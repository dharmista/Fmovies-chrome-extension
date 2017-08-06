// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Dharmista
// @match        https://fmovies.is/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let videoSeqAdded = 0, count;
    let idmText = "";

    document.body.innerHTML += "<div style='position:fixed;top: 0;right: 0;margin: 14px;margin-top : 20%;padding: 10px;display:inline-grid;'><button style='margin-top:10px;'"
        +" id='buttonThatNoOneNamesLikeThis' class='btn btn-primary btn-login'>Download all</button><button id='buttonThatNoOneNamesLikeThisPartTwo' class='btn btn-primary btn-login' style='margin-top:10px;' >Get IDM link file</button></div>";

    document.getElementById("buttonThatNoOneNamesLikeThis").onclick = function(){
        let servers = $(".episodes")[0];
        let episodes = servers.children;
        count = episodes.length;
        for(var i = 0; i < episodes.length ; i++){
            let episode = episodes[i].children[0].href;
            let pieces = episode.split("/");
            let videoId = pieces[pieces.length - 1];
            filesLinkGetter(videoId, false);
        }
    };

    document.getElementById("buttonThatNoOneNamesLikeThisPartTwo").onclick = function () {
        let servers = $(".episodes")[0];
        let episodes = servers.children;
        count = episodes.length;
        for(var i = 0; i < episodes.length ; i++){
            let episode = episodes[i].children[0].href;
            let pieces = episode.split("/");
            let videoId = pieces[pieces.length - 1];
            filesLinkGetter(videoId, true);
        }
    };

    function filesLinkGetter(videoId, forIdm) {
        $.ajax("/ajax/episode/info", {
            data: {
                id: ""+videoId,
                update: 0
            },
            success: function(data, a, b) {
                let rootUrl = data["grabber"];
                rootUrl = rootUrl + "&id=" + videoId + "&token=" + data["params"]["token"] + "&options=" + data["params"]["options"];
                downloader(root Url, videoId, forIdm);

            }
        });
    }

    function createTxtFile() {
        var textFile = null;
        let domHyper = document.createElement('a');

        var data = new Blob([idmText], {type: 'text/plain'});

        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        domHyper.download = "idm links.txt";

        domHyper.href = textFile;

        domHyper.click();
    }

    function downloader(url_, ido, forIdm) {
        $.ajax(url_, {
            data: {
            },
            success: function(data, a, b) {
                let fileUrl = data["data"][data["data"].length - 1]["file"];
                var link=document.createElement("a");
                if(forIdm) {
                    idmText += (fileUrl + "\n");
                    videoSeqAdded += 1;
                    if(videoSeqAdded == count)
                        createTxtFile();
                }
                else {
                    link.href = fileUrl;
                    link.download = ido + ".mp4";
                    link.click();
                }
            }
        });
    }
})();