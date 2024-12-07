const axios = require("axios")
require('dotenv').config();

const token = process.env.GIT_TOKEN;

const progress = async() => {
  // Get profile
  const githubProfile = await axios.get('https://api.github.com/users/itsvivekmandal', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

  let date = githubProfile.data?.created_at;
  date = new Date(date);
  const startYear = date.getFullYear();
  // Create Date Range
  const dateRange = createDateRange(startYear);
  // Get repo list
  const repoData = await axios.get('https://api.github.com/users/itsvivekmandal/repos', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

  let repoList = [];
  repoData.data.forEach(repo => {
    repoList.push(repo.name);
  });
  // let repoList = ['portfolio'];
  const progressData = await getCommitCount(repoList, dateRange);

  let commitData = {'xAxis': [], 'series': []};
  Object.keys(progressData).forEach(year => {
    let years = year.substring(2);
    commitData.xAxis.push(`Q1-${years}`);
    commitData.series.push(progressData[year].Q1);
    commitData.xAxis.push(`Q2-${years}`);
    commitData.series.push(progressData[year].Q2);
    commitData.xAxis.push(`Q3-${years}`);
    commitData.series.push(progressData[year].Q3);
    commitData.xAxis.push(`Q4-${years}`);
    commitData.series.push(progressData[year].Q4);
  });

  return commitData;

};

const createDateRange = (year) => {
  let dateRange = {};
  const currentYear = new Date().getFullYear();
  
  while(year <= currentYear) {
    dateRange[year] = {
      // [`${year}_H1`]: 0,
      // [`${year}_H2`]: 0
      'Q1': 0,
      'Q2': 0,
      'Q3': 0,
      'Q4': 0
    }
    year++;
  }

  return dateRange;
};

const getCommitCount = async(repoList, dateRange) => {
  const promises = repoList.map(async (repo) => {
    try {
      const commits = await axios(`https://api.github.com/repos/itsvivekmandal/${repo}/commits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return commits.data;
    } catch (error) {
      return null;
    }
  });

  const allCommits = await Promise.all(promises);
  const commits = allCommits.filter(Boolean);

  let data = [];
  commits.forEach(repo => {
    repo.forEach(commit => {
      let date = new Date(commit?.commit?.committer?.date);
      let year = date.getFullYear();
      let month = date.getMonth();

      if(month < 3) dateRange[year].Q1 += 1;
      else if (month > 2 && month < 7) dateRange[year].Q2 += 1;
      else if (month > 6 && month < 10) dateRange[year].Q3 += 1;
      else dateRange[year].Q4 += 1;
    });
  });


  return dateRange;
};


module.exports = progress;