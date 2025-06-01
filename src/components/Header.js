import React, { useState } from "react";

const Header = ({ currentNovel, onNovelSelect, novels, onHomeClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="header">
      {/* 左側：首頁按鈕和標題 */}
      <div className="header-left">
        <button className="home-button" onClick={onHomeClick}>
          🏠 首頁
        </button>
        <h1 className="novel-title">{currentNovel?.title || "小說閱讀器"}</h1>
      </div>

      {/* 右側：小說選擇選單 */}
      <div className="header-right">
        <div className="novel-selector">
          <button
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
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
      </div>
    </header>
  );
};

export default Header;
