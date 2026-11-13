# usage: python3 build_moves.py <srcmp4> <out.webp> [height] [fps] [quality]
import sys,subprocess,tempfile,glob,os,numpy as np
from PIL import Image
from rembg import remove,new_session
src,dst=sys.argv[1],sys.argv[2]
H=int(sys.argv[3]) if len(sys.argv)>3 else 360
FPS=int(sys.argv[4]) if len(sys.argv)>4 else 15
Q=int(sys.argv[5]) if len(sys.argv)>5 else 70
d=tempfile.mkdtemp()
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',src,'-vf',f'fps={FPS},scale=540:-1',f'{d}/%03d.png'],check=True)
s=new_session('u2net_human_seg')
fr=[remove(Image.open(p).convert('RGB'),session=s) for p in sorted(glob.glob(d+'/*.png'))]
A=np.max(np.stack([np.array(f)[...,3] for f in fr]),0); ys,xs=np.where(A>10)
W=fr[0].width
# square-ish crop centred on figure so all moves share framing
cx=(xs.min()+xs.max())//2; top=max(0,ys.min()-12); bot=min(fr[0].height,ys.max()+12)
side=max(bot-top,xs.max()-xs.min()+24)
x0=max(0,min(W-side,cx-side//2)); box=(x0,top,x0+side,top+side) if top+side<=fr[0].height else (x0,fr[0].height-side,x0+side,fr[0].height)
fr=[f.crop(box).resize((H,H),Image.LANCZOS) for f in fr]
fr[0].save(dst,save_all=True,append_images=fr[1:],duration=int(1000/FPS),loop=0,quality=Q,method=6)
print(os.path.basename(dst),len(fr),os.path.getsize(dst)//1024,'KB')
