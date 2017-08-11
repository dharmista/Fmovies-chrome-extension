import os, sys
try:
    from pySmartDL import SmartDL
except Exception as e:
    os.popen("pip install pySmartDL")

DOWNLOAD_PATH = "c:\\batman\\Downloads"

def download(url, path, filename, serial):

    obj = SmartDL(url, path + "\\"+filename+" episode {}- .mp4".format(serial))
    obj.start()

if __name__ == '__main__':
    if(len(sys.argv) != 3):
        raise Exception("Invalid arguments")
    urls = sys.argv[1]
    filename = sys.argv[2]

    f = open(urls)
    index = 0

    for file in f.readlines():
        # or '~/batman/Downloads/' on linux
        download(file, DOWNLOAD_PATH, filename, index)
        index+=1
    f.close()