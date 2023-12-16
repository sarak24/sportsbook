import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GameHistory1.css'; 
const GameHistory1 = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [pager, setPager] = useState([]);

  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchGames = async () => {
      try {
        setGames([]);
        const res = await axios.get(`http://localhost:8080/game_table?page=${currentPage}&limit=${gamesPerPage}`);
        setGames(res.data.games);
        setTotalPages(res.data.totalPages); 
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, [currentPage, gamesPerPage]);

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



  const handleGameClick = async (team1, team2, gameDate) => {
    navigate(`/game-history-2/${team1}/${team2}/${formatDate(gameDate)}`);
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
            <th>Team</th>
            <th>Opponent</th>
            <th>Game Date</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
        {games.map(game => (
          <tr key={game.game_date} onClick={() => handleGameClick(game.team1, game.team2, game.game_date)}>
              <td>{game.team1}</td>
              <td>{game.team2}</td>
              <td>{formatDate(game.game_date)}</td> 
              <td>{game.final_score}</td>
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
