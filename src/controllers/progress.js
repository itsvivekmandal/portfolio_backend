const axios = require("axios")

const progress = async() => {
  // Get profile
  const githubProfile = await axios.get('https://api.github.com/users/itsvivekmandal');
  let date = githubProfile.data?.created_at;
  date = new Date(date);
  const startYear = date.getFullYear();
  // Create Date Range
  const dateRange = createDateRange(startYear);
  // Get repo list
  const repoData = await axios.get('https://api.github.com/users/itsvivekmandal/repos');
  let repoList = [];
  repoData.data.forEach(repo => {
    repoList.push(repo.name);
  });

  const progressData = getCommitCount(repoList, dateRange);

  return progressData;

};

const createDateRange = (year) => {
  let dateRange = {};
  const currentYear = new Date().getFullYear();
  
  while(year <= currentYear) {
    dateRange[year] = {
      // [`${year}_H1`]: 0,
      // [`${year}_H2`]: 0
      'H1': 0,
      'H2': 0
    }
    year++;
  }

  return dateRange;
};

const getCommitCount = async(repoList, dateRange) => {
  const promises = repoList.map(async (repo) => {
    try {
      const commits = await axios(`https://api.github.com/repos/itsvivekmandal/${repo}/commits`);
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

      if(month < 6) dateRange[year].H1 += 1;
      else dateRange[year].H2 += 1;
    });
  });


  return dateRange;
};


module.exports = progress;