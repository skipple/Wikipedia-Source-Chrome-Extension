//get the search results from the page
let search_results = getSearchResults();

// check the results against list of known URLs, if on the list, add an icon
function getSearchResults(){
    allLinks = document.body.querySelectorAll("div.TbwUpd cite.iUh30");
    if (allLinks.length != 0){
        console.log(allLinks[0].innerText);
        checkAllResults(allLinks);
    }
    else{
        console.log("unable to find any links on \'All Page.\' Trying News.");
        newsLinks = document.body.querySelectorAll("div.BGxR7d a.WlydOe");
        console.log(newsLinks);
        checkNewsResults(newsLinks);
    }
}

async function checkAllResults(results_list){
    //get the list of sources that are available from json
    let sourceListID = await getSourceID()
    //for each search result, check against the list of sources
    //if source exists, add the icon
    for (i=0; i < results_list.length; i+=2){
        link = results_list[i];
        //remove http and www
        domain = link.innerText.split(" ")[0];
        short_domain = domain.split("//")[1];
        if (short_domain.substring(0,4) === 'www.'){
            short_domain = short_domain.substring(4,short_domain.length);
        }
        //check if the domain is on the list of domains from wiki, if so, add an icon.
        if (sourceListID.sources[short_domain] != undefined){
            sourceID = sourceListID.sources[short_domain];
            console.log('adding source id:', sourceID);
            addIcon(link, sourceID);
        }
    }      
}


async function checkNewsResults(results_list){
    //get the list of sources that are available from json
    let sourceListID = await getSourceID()
    //for each search result, check against the list of sources
    //if source exists, add the icon
    for (i=0; i < results_list.length;i++){
        link = results_list[i];
        //remove http and www
        domain = link.origin.split(" ")[0];
        short_domain = domain.split("//")[1];
        if (short_domain.substring(0,4) === 'www.'){
            short_domain = short_domain.substring(4,short_domain.length);
        };
        //check if the domain is on the list of domains from wiki, if so, add an icon.
        if (sourceListID.sources[short_domain] != undefined){
            sourceID = sourceListID.sources[short_domain];
            console.log('adding source id:', sourceID);
            addIcon(link, sourceID);
        }
    }
}

async function addIcon(link_location, site_id){
    //create icon image
    let wikiIcon = document.createElement("img");
    //get the source information and determine which icon to add
    let source_data = await getSources();
    let image = "data/icons/" + source_data.sources[site_id].status + ".svg";
    wikiIcon.src = chrome.runtime.getURL(image);
    link_location.before(wikiIcon);
    console.log(link_location);
    wikiIcon.classList.add("wiki-icon");
}

async function getSourceID(){
    let source_id_url = chrome.runtime.getURL('data/source_id.json');
    try{
        let source_id_data = await fetch(source_id_url);
        return await source_id_data.json();
    } catch (error) {
        console.log("Error getting source id");
    }
}

async function getSources(){
    let sources_url = chrome.runtime.getURL('data/sources.json');
    try{
        let sources = await fetch(sources_url);
        return await sources.json();
    } catch (error) {
        console.log("Error getting source");
    }
}