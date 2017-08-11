"""
    Simple python code to download the files similar to that of IDM.
    The download links must be passed as a file, and the default file name should be given.

    Ex : python idm.py "Game of Thrones 7 2017 OnlineFri, 11 Aug 2017 11-00-54.txt" GOT
"""
import os, sys
import threading

try:
    from pySmartDL import SmartDL
except Exception as e:
    os.popen("pip install pySmartDL")
    exit(0)

DEFAULT_DOWNLOAD_PATH = "c:\\fMovies\\Downloads"
"""
    Keep this based on the size of file u download.
    Size (directly proportional to) thread count
"""
THREADS_TO_SPLIT = 5

def download(url, path, filename, serial):

    obj = SmartDL(url, path + "\\"+filename+" episode - {}.mp4".format(serial),
                  progress_bar=True, threads = THREADS_TO_SPLIT)

    obj.start()

    print("Downloaded episode {}".format(serial))

if __name__ == '__main__':
    if(len(sys.argv) < 3):
        print("Invalid length of arguments..")
        print("Should be like python <file name>.py <file_with_urls> <name_for_episodes> <download_path_optional>")
        exit(0)
    urls = sys.argv[1]
    filename = sys.argv[2]
    if(len(sys.argv) > 3):
        DEFAULT_DOWNLOAD_PATH = sys.argv[3]
    try:
        f = open(urls)
        index = 1

        print("Started Downloading the episodes")
        for file in f.readlines():
            #'~/batman/Downloads/' on linux
            download(file.strip("\n"), DEFAULT_DOWNLOAD_PATH, filename, index)
            index += 1
        f.close()
        print("Downloaded successfully {} episodes..".format(index))
    except FileNotFoundError as e:
        print("No such file with episodes.. If your file name has spaces, enclose it in double quotes")