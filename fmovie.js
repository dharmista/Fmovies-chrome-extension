// ==UserScript==
// @name         Fmovies series extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Dharmista
// @match        https://fmovies.is/film/*
// @grant        none
// ==/UserScript==

/**
 * Documentation and installation can be found in <a href='fmovies.helplena.co'>Here</a>
 */
(function() {
    'use strict';

    let videoSeqAdded = 0, count;
    let idmlinks = null;
    let servers = $(".episodes");
    console.log("here");

    document.body.innerHTML += ("<div style='position:fixed;top: 0;right: 0;margin: 14px;margin-top : 20%;padding: 10px;display:inline-grid;'><button style='margin-top:10px;' id='buttonThatNoOneNamesLikeThis' class='btn btn-primary btn-login'>Download all</button><button id='buttonThatNoOneNamesLikeThisPartTwo' class='btn btn-primary btn-login' style='margin-top:10px;' >Get IDM link file</button></div>");
    document.body.innerHTML += "<div class='loader' style='display: none;position: fixed;z-index: 10000;top: 0;right: 0;bottom: 0;left: 0;'> <div class='blank' style='opacity: 0.8;top: 0;right: 0;bottom: 0;left: 0;background-color: black;position: absolute;z-index: -1;'></div> <p id='noOneWillNameInThisManner' class='loader-text' style='font-family: helvetica;font-size: 32px;color: white;margin-top: 200px;z-index: 10000;text-align: center;'>Generating...</p><p style='font-family: helvetica;font-size: 32px;color: white;margin-top: 200px;z-index: 10000;text-align: center;'>This might take a while. You can leave ths at background.</p> </div>";

    document.getElementById("buttonThatNoOneNamesLikeThis").onclick = function(){
        let i;let serverSelected = 0;videoSeqAdded = 0;
        let ranges =  ($(".ranger")[0] == undefined)?1:$(".ranger")[0].children.length;
        for(i = 0; i < servers.length/ranges; i++){
            let a = servers[i * ranges];
            let serverName = a.parentElement.parentElement.children[0].innerText;
            //Selects the Fmovies-4 server
            if(serverName.indexOf("F4") != -1)
                serverSelected = i * ranges;
        }
        let server = servers[serverSelected];
        let episodes = new Array();
        count = 0;
        for(let counter = 0; counter < ranges; counter++) {
            count += servers[serverSelected + counter].children.length;
            let k = servers[counter].children;
            for(var t = 0; t < k.length; t++)
                episodes.push(k[t]);
        }
        let countOfIndex = 0;
        for(let index = 0; index < ranges; index+=1) {
            for (i = 0; i < episodes.length; i++) {
                if(episodes[i + index * episodes.length] != undefined) {
                    let episode = episodes[i + index * episodes.length].children[0].href;
                    let pieces = episode.split("/");
                    let videoId = pieces[pieces.length - 1];
                    filesLinkGetter(videoId, false, countOfIndex);
                    countOfIndex += 1;
                }
            }
        }
    };

    document.getElementById("buttonThatNoOneNamesLikeThisPartTwo").onclick = function () {
        $(".loader").show();videoSeqAdded = 0;
        let i;let serverSelected = 0;
        let ranges =  ($(".ranger")[0] == undefined)?1:$(".ranger")[0].children.length;
        for(i = 0; i < servers.length/ranges; i++){
            let a = servers[i * ranges];
            let serverName = a.parentElement.parentElement.children[0].innerText;
            //Selects the Fmovies-4 server
            if(serverName.indexOf("F4") != -1)
                serverSelected = i * ranges;
        }
        let server = servers[serverSelected];
        let episodes = new Array();
        count = 0;
        for(let counter = 0; counter < ranges; counter++) {
            count += servers[serverSelected + counter].children.length;
            let k = servers[counter].children;
            for(var t = 0; t < k.length; t++)
                episodes.push(k[t]);
        }
        let countOfIndex = 0;
        for(let index = 0; index < ranges; index+=1) {
            for (i = 0; i < episodes.length; i++) {
                if(episodes[i + index * episodes.length] != undefined) {
                    let episode = episodes[i + index * episodes.length].children[0].href;
                    let pieces = episode.split("/");
                    let videoId = pieces[pieces.length - 1];
                    filesLinkGetter(videoId, true, countOfIndex);
                    countOfIndex += 1;
                }
            }
        }
    };

    function filesLinkGetter(videoId, forIdm, index) {
        let rootUrl = "";

        $.ajax("/ajax/episode/info", {
            data: {
                id: ""+videoId,
                update: 0
            },
            success: function(data, a, b) {
                rootUrl = data["grabber"];
                rootUrl = rootUrl + "&id=" + videoId + "&token=" + data["params"]["token"] + "&options=" + data["params"]["options"];
                downloader(rootUrl, videoId, forIdm, index);
            },
            error : function (data) {
                setTimeout(function(){filesLinkGetter(videoId, forIdm, index);}, 20000);
            }
        });
    }

    function createTxtFile() {
        let textFile = null;
        let domHyper = document.createElement('a');
        console.log(idmlinks);

        let idmLinksText = "";
        for(let i = 0; i < count; i++)
            idmLinksText += (idmlinks[i]+"\n");
        const data = new Blob([idmLinksText], {type: 'text/plain'});

        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);
        let str = new Date().toGMTString();

        domHyper.download = str.substr(0, str.length - 4)+".txt";

        domHyper.href = textFile;

        domHyper.click();

        $(".loader").hide();
    }

    function downloader(url_, ido, forIdm, index) {
        $.ajax(url_, {
            data: {
            },
            success: function(data, a, b) {
                let fileUrl = data["data"][data["data"].length - 1]["file"];
                const link = document.createElement("a");
                if(forIdm) {
                    if(idmlinks == null){
                        idmlinks = new Array(count);
                    }
                    idmlinks[index] = fileUrl;
                    videoSeqAdded += 1;
                    $("#noOneWillNameInThisManner")[0].innerHTML = "Generating "+videoSeqAdded+" / "+count;
                    console.log(videoSeqAdded);
                    if(videoSeqAdded == count)
                        createTxtFile();
                }
                else {
                    link.href = fileUrl;
                    link.download = ido + ".mp4";
                    link.click();
                }
            },
            error : function (data) {
                setTimeout(function(){downloader(url_, ido, forIdm, index);},20000);
            }
        });
    }
})();