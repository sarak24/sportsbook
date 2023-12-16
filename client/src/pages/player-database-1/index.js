import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlayerDatabase1.css'; 


const GameHistory1 = () => {
      const [players, setPlayers] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [playersPerPage] = useState(10);
      const [totalPages, setTotalPages] = useState(0);
      const [pager, setPager] = useState([]);
    
      const navigate = useNavigate(); 
    
    
      useEffect(() => {
        const fetchPlayers = async () => {
          try {
            setPlayers([]);
            const res = await axios.get(`http://localhost:8080/player_database?page=${currentPage}&limit=${playersPerPage}`);
            setPlayers(res.data.players);
            setTotalPages(res.data.totalPages); 
          } catch (error) {
            console.error('Error fetching games:', error);
          }
        };
    
        fetchPlayers();
      }, [currentPage, playersPerPage]);
    
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
    
    
    
      const handlePlayerClick = async (first_name, last_name) => {
        navigate(`/player-database-2/${first_name}/${last_name}`);
      };
    
      const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
      };
    
      const formatDate = (dateString) => {
        return dateString.split('T')[0];
      };
      
    
      return (
        <div className='game-history-container'>
          <table className='game-table'>
            <thead>
              <tr className='game-table-header'>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Current Team</th>
                <th>High School</th>
              </tr>
            </thead>
            <tbody>
            {players.map(player => (
              <tr key={player.first_name} onClick={() => handlePlayerClick(player.first_name, player.last_name)}>
                  <td>{player.first_name}</td>
                  <td>{player.last_name}</td>
                  <td>{player.current_team}</td> 
                  <td>{player.high_school}</td>
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
    
export default GameHistory1;
    

