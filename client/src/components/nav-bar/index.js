import { Link, useLocation } from "react-router-dom";

import style from "./navbar.module.scss";
import profileImg from "../../assets/profile.png";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <div className={style.container}>
      <Link to="/">
        <h1 className="text-3xl">My Sportsbook</h1>
      </Link>

      <Link to={"/userProfile"}>
        <img
          className={style.profile}
          alt="profile img"
          src={profileImg}
          width={30}
        />
      </Link>
    </div>
  );
};

export default Navbar;
