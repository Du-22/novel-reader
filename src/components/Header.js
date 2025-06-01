import React, { useState } from "react";
const Header = ({ currentNovel, onNovelSelect, novels = { novels } }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="header">
      <h1 className="novel-title">{currentNovel?.title || "請選擇小說"}</h1>
      <div className="novel-selector">
        <button
          className="menu-button"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          ☰ 選擇小說
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            {novels.map((novel) => (
              <div
                key={novel.id}
                className="menu-item"
                onClick={() => {
                  onNovelSelect(novel);
                  setShowMenu(false);
                }}
              >
                {novel.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
