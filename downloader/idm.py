import os, sys
try:
    from pySmartDL import SmartDL
except Exception as e:
    os.popen("pip install pySmartDL")

def download(url, path, filename):

    obj = SmartDL(url, path + "\\"+filename+".mp4")
    obj.start()

if __name__ == '__main__':
    urls = sys.argv[1]
    filename = sys.argv[2]

    f = open(urls)

    for file in f.readlines():
        # or '~/batman/Downloads/' on linux
        download(file, "c:\\batman\\Downloads", filename)