const axios = require("axios");
const { json } = require("express/lib/response");
require('dotenv').config();

const token = process.env.GIT_TOKEN;

const progress = async() => {
    // Create Date Range
    const dateRange = await createDateRange();
    // Prepare Data
    const data = await prepareData(dateRange);

    return data;
};

// const createDateRange = async() => {
//     let dateRange = {};

//     const date = await getStartDate();

//     if(!date) return dateRange;
    
//     let startDate = new Date(date);
//     const endDate = new Date();
    
    
//     while (startDate <= endDate) {
//         // convert to YYYY-MM-DD
//         // const formatted = startDate.toISOString().split('T')[0];
//         const formatted = startDate.toISOString().slice(0, 7);
        
//         dateRange[formatted] = 0;
//         // move to next day
//         // startDate.setDate(startDate.getDate() + 1);
//         startDate.setMonth(startDate.getMonth() + 3);
//     }

//     return dateRange;
// };

const createDateRange = async () => {
    let dateRange = {};

    const date = await getStartDate();
    if (!date) return dateRange;

    let startDate = new Date(date);
    const endDate = new Date();

    while (startDate <= endDate) {
        const year = startDate.getFullYear();
        const half  = Math.ceil((startDate.getMonth() + 1) / 6);

        const key = `${year}-H${half }`;

        // avoid duplicates (important)
        if (!dateRange[key]) {
            dateRange[key] = 0;
        }

        // move to next half 
        startDate.setMonth(startDate.getMonth() + 6);
    }

    return dateRange;
};

const prepareData = async(dateRange) => {
    let repoList = [];
    const repository = await getRepository();

    if(!repository) return [];

    repository.forEach(repo => {
        repoList.push(repo.name);
    });

    const data = await getCommitCount(repoList, dateRange);

    const output = Object.entries(data).map(([date, value]) => ({
        x: date,
        y: value
    }));

    const result =  [
        {
            id: "progress",
            data: output ?? [],
        },
    ];

    return result;
};

const getStartDate = async () => {
    try {
        const res = await axios.get('https://api.github.com/users/itsvivekmandal',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            }
        );

        return res?.data?.created_at ?? null;

    } catch (error) {
        console.error(error);
        return null;
    }
};

const getRepository = async() => {
    try {        
        const repoData = await axios.get('https://api.github.com/users/itsvivekmandal/repos', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            }
        );
        return repoData?.data ?? [];
    } catch (error) {
        console.error(error);
        return [];   
    }
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
            return commits?.data;
        } catch (error) {
            return null;
        }
    });

    const allCommits = await Promise.all(promises);
    const commits = allCommits.filter(Boolean);

    commits.forEach(repo => {
        repo.forEach(commit => {
            const date = new Date(commit?.commit?.committer?.date);
            // let date = new Date(commit?.commit?.committer?.date).toISOString().slice(0, 7);
            const year = new Date(date).getFullYear();
            const quarter = Math.ceil((new Date(date).getMonth() + 1) / 6);

            const key = `${year}-H${quarter}`;
            dateRange[key] += 1;
        });
    });


  return dateRange;
};

module.exports = progress;
