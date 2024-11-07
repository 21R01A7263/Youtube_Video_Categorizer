function fetchVideoDetails(apiKey, videoId) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;

  fetch(apiUrl).
  then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed. Status:', response.status);
    }
  }).
  then(data => {
    if (data.items.length > 0) {
      const videoDetails = data.items[0];
      const title = videoDetails.snippet.title;
      const views = videoDetails.statistics ? videoDetails.statistics.viewCount : 'N/A';
      const categoryId = videoDetails.snippet.categoryId;
      const thumbnailUrl = videoDetails.snippet.thumbnails.maxres.url;
      const genre = determineGenre(categoryId);
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `
          <p style="text-align:center; margin-bottom: 2vh;" ><b>Title:</b><br> ${title}</p>
          <p style="text-align:center; margin-bottom: 2vh;"><b>Views:</b><br> ${views}</p>
          <p style="text-align:center;  margin-bottom: 5vh;"><b>Category:</b><br> ${genre}</p>
          
          <div>
          <img src="${thumbnailUrl}" alt="Video Thumbnail" style="display: block; max-width:320px; border-radius:10px; max-height:320px; margin-left: auto; margin-right: auto;">
          </div>
          
        `;
    } else {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `
          <p style="margin-right: 9vw; font-size: 22px; margin-bottom:2vw;"><b>Invalid Video</b></p>
        `;
    }
  }).
  catch(error => {
    console.log('An error occurred while fetching video details:', error);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  const videoUrl = document.getElementById('videoUrl').value;
  const apiKey = 'AIzaSyB_bBcJBvuoYaGVDRR76KqxdcMw-yyvO98';
  const videoId = videoUrl.split('v=')[1];
  console.log(videoId);

  fetchVideoDetails(apiKey, videoId);
}

function determineGenre(categoryId) {

  switch (categoryId) {
    case '1':
      return 'Film & Animation';
    case '2':
      return 'Autos & Vehicles';
    case '10':
      return 'Music';
    case '15':
      return 'Pets & Animals';
    case '17':
      return 'Sports';
    case '18':
      return 'Short Movies';
    case '19':
      return 'Travel & Events';
    case '20':
      return 'Gaming';
    case '21':
      return 'Video Blogging';
    case '22':
      return 'People & Blogs';
    case '23':
      return 'Comedy';
    case '24':
      return 'Entertainment';
    case '25':
      return 'News & Politics';
    case '26':
      return 'Howto & Style';
    case '27':
      return 'Education';
    case '28':
      return 'Science & Technology';
    case '29':
      return 'Nonprofits & Activism';
    case '30':
      return 'Movies';
    case '31':
      return 'Anime/Animation';
    case '32':
      return 'Action/Adventure';
    case '33':
      return 'Classics';
    case '34':
      return 'Comedy';
    case '35':
      return 'Documentary';
    case '36':
      return 'Drama';
    case '37':
      return 'Family';
    case '38':
      return 'Foreign';
    case '39':
      return 'Horror';
    case '40':
      return 'Sci-Fi/Fantasy';
    case '41':
      return 'Thriller';
    case '42':
      return 'Shorts';
    case '43':
      return 'Shows';
    case '44':
      return 'Trailers';
    default:
      return 'Unknown Genre';}

}

const videoFetch = document.getElementById('videoFetch');
videoFetch.addEventListener('click', handleSubmit);
