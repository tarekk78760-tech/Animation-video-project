import numpy as np, soundfile as sf, sys
from scipy.signal import butter, sosfilt
SR=48000; rng=np.random.default_rng(7)
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b): return sosfilt(butter(2,[a,b],'band',fs=SR,output='sos'),x)
def env(n,a,d):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)*np.exp(-t/d); return e
def tanpura(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR; out=np.zeros(n)
    pattern=[f*1.5/2,f,f,f/2]  # Pa Sa Sa Sa(low)
    step=1.1; k=0
    while k*step<dur:
        fr=pattern[k%4]; s=int(k*step*SR); L=min(n-s,int(4.5*SR)); tt=np.arange(L)/SR
        tone=sum((0.6/h)*np.sin(2*np.pi*fr*h*tt+rng.uniform(0,6))*(1+0.3*np.sin(2*np.pi*(0.7+h*0.13)*tt)) for h in range(1,12))
        out[s:s+L]+=tone*env(L,0.05,2.2); k+=1
    return lp(out,3500)*0.12
def pluck(f,L,bright=0.5):
    from scipy.signal import lfilter
    N=int(SR/f); exc=np.zeros(L); exc[:N]=lp(rng.uniform(-1,1,N*3),f*8)[:N]
    a=np.zeros(N+2); a[0]=1; a[N]=-0.498; a[N+1]=-0.498
    out=lfilter([1],a,exc)
    # sitar buzz: slight nonlinearity + sympathetic shimmer
    out=np.tanh(out*2.0)*0.6+0.08*hp(out,2500)
    return out*env(L,0.002,1.2)
def flute(f,L):
    t=np.arange(L)/SR; vib=1+0.006*np.sin(2*np.pi*5.2*t)*np.minimum(1,t/0.4)
    ph=2*np.cumsum(np.pi*f*vib)/SR
    tone=np.sin(ph)+0.25*np.sin(2*ph)+0.08*np.sin(3*ph)
    breath=bp(rng.normal(0,1,L),f*0.8,f*3)*0.15
    a=np.minimum(1,t/0.15)*np.minimum(1,(L/SR-t)/0.3)
    return (tone+breath)*a*0.35
def tabla(kind,L=int(0.5*SR)):
    t=np.arange(L)/SR
    if kind=='dha':  # bass bayan + treble
        f=110*np.exp(-t*3)+70; x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*6)
        x+=0.5*np.sin(2*np.pi*420*t)*np.exp(-t*18)
    elif kind=='na':
        x=0.6*np.sin(2*np.pi*560*t)*np.exp(-t*22)+0.2*bp(rng.normal(0,1,L),2000,6000)*np.exp(-t*60)
    else:  # ti
        x=0.3*bp(rng.normal(0,1,L),3000,8000)*np.exp(-t*80)
    return x
def reverb(x,mix=0.25):
    ir_n=int(2.2*SR); ir=rng.normal(0,1,ir_n)*np.exp(-np.arange(ir_n)/SR*3); ir=lp(ir,6000)
    from scipy.signal import fftconvolve
    w=fftconvolve(x,ir)[:len(x)]; w/=np.max(np.abs(w))+1e-9
    return x*(1-mix)+w*mix*np.max(np.abs(x))
def track(dur,scale,root,bpm,seed,bright):
    global rng; rng=np.random.default_rng(seed)
    n=int(dur*SR); mel=np.zeros(n); perc=np.zeros(n)
    beat=60/bpm; notes=[root*2**(s/12) for s in scale]
    t=2.0; idx=2
    while t<dur-3:
        idx=int(np.clip(idx+rng.choice([-2,-1,-1,0,1,1,2]),0,len(notes)-1))
        f=notes[idx]*(2 if rng.random()<0.25 else 1)
        L=int(SR*rng.choice([beat,beat*2,beat*2,beat*3])); s=int(t*SR)
        if rng.random()<0.7: seg=pluck(f,min(L+SR,n-s))
        else: seg=flute(f,min(int(L*1.5),n-s))
        mel[s:s+len(seg)]+=seg*rng.uniform(0.6,1)
        t+=L/SR+(beat*rng.choice([0,0,1,2]) if rng.random()<0.5 else 0)
    # keherwa 8-beat: dha ge na ti na ka dhi na
    pat=['dha','ti','na','ti','na','ti','dha','na']
    k=0; start=8.0
    while start+k*beat/2<dur-2:
        s=int((start+k*beat/2)*SR); x=tabla(pat[k%8]); L=min(len(x),n-s)
        perc[s:s+L]+=x[:L]*(0.9 if k%8==0 else 0.6)*rng.uniform(0.85,1); k+=1
    dr=tanpura(root,dur)
    mix=dr*1.0+reverb(mel,0.35)*0.5+perc*0.22*bright
    fade=np.ones(n); fi=int(3*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fi:]=np.linspace(1,0,fi)
    mix*=fade; mix/=np.max(np.abs(mix))*1.12
    st=np.stack([mix, np.roll(mix,int(0.012*SR))*0.97],1)  # width
    return st
dur1=float(sys.argv[1]); dur2=float(sys.argv[2]); out=sys.argv[3]
bhairav=[0,1,4,5,7,8,11,12]; yaman=[0,2,4,6,7,9,11,12]
sf.write(out+'/music1.wav',track(dur1,bhairav,146.83,76,1,0.7),SR)
sf.write(out+'/music2.wav',track(dur2,yaman,164.81,88,2,1.0),SR)
# whoosh
L=int(1.2*SR); t=np.arange(L)/SR; nz=rng.normal(0,1,L)
w=np.zeros(L)
for i in range(0,L,480):
    fc=300+3500*np.sin(np.pi*min(1,i/L))**2; w[i:i+480]=bp(nz[i:i+480+0],fc*0.7,fc*1.3)[:len(w[i:i+480])]
w=lp(nz,2500)*np.sin(np.pi*t/1.2)**3; w/=np.max(np.abs(w))
sf.write(out+'/whoosh.wav',np.stack([w*np.linspace(1,0.4,L),w*np.linspace(0.4,1,L)],1)*0.8,SR)
print('ok')
