import os, sys
import threading

try:
    from pySmartDL import SmartDL
except Exception as e:
    os.popen("pip install pySmartDL")
    exit(0)

#Set your own download path
DOWNLOAD_PATH = "c:\\batman\\Downloads"
"""
    Keep this based on the size of file u download.
    Size (directly proportional to) thread count
"""
THREADS_TO_SPLIT = 5

def download(url, path, filename, serial):

    obj = SmartDL(url, path + "\\"+filename+" episode {}- .mp4".format(serial), progress_bar=False, threads = THREADS_TO_SPLIT)

    obj.start()

    print("Downloaded successfully episode {}".format(serial))

if __name__ == '__main__':
    if(len(sys.argv) != 3):
        raise Exception("Invalid arguments")
    urls = sys.argv[1]
    filename = sys.argv[2]

    f = open(urls)
    index = 0

    for file in f.readlines():
        #'~/batman/Downloads/' on linux
        thread = threading.Thread(target=download, args=(file, DOWNLOAD_PATH, filename, index))
        thread.start()
        index+=1
    f.close()
    print("Working on the downloads.. Downloading parallel'y. Leave this window behind")