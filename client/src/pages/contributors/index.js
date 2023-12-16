import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contributors.css'; 


const Contributors = () => {

    const [contributors, setContributors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [contributorsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [pager, setPager] = useState([]);  
    const [showSuggestions, setShowSuggestions] = useState(true);  
    const [searchTerm, setSearchTerm] = useState('');
    const [teamList, setTeamList] = useState([]);

    useEffect(() => {
        const fetchTeamList = async () => {
          try {
            const response = await axios.get('http://localhost:8080/teams'); 
            setTeamList(response.data); 
          } catch (error) {
            console.error('Error fetching team list:', error);
          }
        };
      
        fetchTeamList();
    }, []);
    

    const fetchContributors = async (teamName = searchTerm) => {
      try {
          setContributors([]);
          let url = `http://localhost:8080/contributors?page=${currentPage}&limit=${contributorsPerPage}`;
          if (teamName) {
              url += `&team=${teamName}`;
          }
          console.log(`Fetching contributors with URL: ${url}`); 
          const res = await axios.get(url);
          console.log("this is fetched",res.data.data); 
          setContributors(res.data.data);
          setTotalPages(res.data.totalPages);
      } catch (error) {
          console.error('Error fetching contributors:', error);
          console.log(error.response.data); 
      }
  };
  
    useEffect(() => {
      fetchContributors(searchTerm);
    }, [currentPage, contributorsPerPage, searchTerm]);
  
    useEffect(() => {
      if (totalPages > 0) {
        setPager(getPager(totalPages, currentPage));
      }
    }, [totalPages, currentPage]);
  
    function getPager(totalPages, currentPage, pageSize = 10) {
      let startPage, endPage;
  
      if (totalPages <= pageSize) {
        startPage = 1;
        endPage = totalPages;
      } else {
        if (currentPage <= 6) {
          startPage = 1;
          endPage = pageSize;
        } else if (currentPage + 4 >= totalPages) {
          startPage = totalPages - 9;
          endPage = totalPages;
        } else {
          startPage = currentPage - 5;
          endPage = currentPage + 4;
        }
      }
    
      const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
  
      return {
          currentPage: currentPage,
          totalPages: totalPages,
          pages: pages
      };
   }
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true); 
      };
      
    const handleSelectTeam = (searchTerm) => {
        setSearchTerm(searchTerm);
        setShowSuggestions(false); 
        fetchContributors(); 
      };
      
      const handleSearchSubmit = () => {
        console.log("Search button clicked"); 
        setShowSuggestions(false);
        fetchContributors(searchTerm);
    };
    
    
  
    return (
      <div className='game-history-container'>
        <div className="search-container">
        <div className="search-instruction"><b>Search by Team:</b></div>
        <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Type to search..."
        />
        <button className="search-button" onClick={handleSearchSubmit}>Find Team</button>
        {searchTerm && showSuggestions &&(
            <ul className="autocomplete-list">
            {teamList.filter(teamObj => 
                teamObj.team.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(teamObj => (
                <li key={teamObj.team} onClick={() => handleSelectTeam(teamObj.team)}>
                    {teamObj.team}
                </li>
            ))}
            </ul>
        )}
        </div>
        <table className='game-table'>
          <thead>
            <tr className='game-table-header'>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Player Points</th>
              <th>Percentage</th>
              <th>Season Years</th>
            </tr>
          </thead>
          <tbody>
          {contributors.map(contributor => (
            <tr>
                <td>{contributor.first_name}</td>
                <td>{contributor.last_name}</td>
                <td>{contributor.player_points}</td>
                <td>{(contributor.percentage * 100).toFixed(2)}</td>
                <td>{contributor.season_years}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <button className="page-item" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &laquo;
          </button>
          {pager.pages && pager.pages[0] > 1 && (
            <>
              <button className="page-item" onClick={() => handlePageChange(1)}>1</button>
              {pager.pages[0] !== 2 && <span className="page-item dots">...</span>}
            </>
          )}
          {pager.pages && pager.pages.map(page =>
            <button key={page} className={`page-item ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
              {page}
            </button>
          )}
          {pager.pages && pager.pages[pager.pages.length - 1] < totalPages && (
            <>
              {pager.pages[pager.pages.length - 1] !== totalPages - 1 && <span className="page-item dots">...</span>}
              <button className="page-item" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
            </>
          )}
          <button className="page-item" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &raquo;
          </button>
        </div>
      </div>
    );
  };

export default Contributors;
