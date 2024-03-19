import { get } from 'https';
import { parse } from 'url';

export const getStories = async () => {
  const websiteUrl = 'https://time.com';
  const response = await fetchData(websiteUrl);
  // console.log("response:",response)

  // Extract latest 6 stories
  // const stories = [];
  // const storyElements = response.split('<li class="latest-stories__item">').slice(1, 7);

  // for (const element of storyElements) {
  //   const title = element.split('</a>')[0].split('<h3 class="latest-stories__item-headline">')[1].split("</h3>")[0];
  //   const link = websiteUrl + element.split('href="')[1].split('"')[0];
  //   stories.push({ title, link });
  // }

  let start = response.indexOf("<header");
  let end = response.indexOf("</body>");
  let responseBody = [];
  for (let index = start; index < end; index++) {
    responseBody.push(response[index]);
  }
  responseBody = responseBody.join("");
  // console.log("body:",responseBody)

  start = responseBody.indexOf("Latest Stories</h2>");
  end = responseBody.lastIndexOf("latest-stories__item-timestamp")
  let sectionData = [];
  for (let index = start; index < end; index++) {
    sectionData.push(responseBody[index]);
  }
  sectionData = sectionData.join("");
  // console.log("section:", sectionData)

  const stories = [];
  let href = false;
  let h3 = false;
  let title = [];
  let link = [];
  for (let index = 0; index < sectionData.length; index++) {
    if(sectionData[index]==='"' && sectionData[(index-2)]==='f'){
      href = true;
    }

    else if (sectionData[index] ==='"' && href) {
      href = false;
      // console.log("Links:",websiteUrl + link.join(""));
    }

    else if (href) {
      link.push(sectionData[index]);
    }
    else{}

    if(sectionData[index]==='>' && sectionData[(index-1)]==='"' && sectionData[index-2]==='e'){
      h3 = true;
    }
    else if(sectionData[index] ==='<' && h3){
      h3 = false;
      // console.log("title:",title.join(""));
      stories.push({ title:title.join(""), link: websiteUrl + link.join("")});
      title = [];
      link = [];
    }
    else if(h3){
      title.push(sectionData[index]);
    }
    else{}
    
  }


  console.log("stories:",stories)
  return stories;
};

const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    const options = parse(url);
    get(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

