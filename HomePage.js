import React from "react";

const HomePage = ({ novels, onNovelSelect }) => {
  return (
    <div className="homepage">
      <div className="homepage-header">
        <h1 className="homepage-title">📚 小說閱讀器</h1>
        <p className="homepage-subtitle">選擇你想要閱讀的小說</p>
      </div>

      <div className="novels-grid">
        {novels.map((novel) => (
          <div
            key={novel.id}
            className="novel-card"
            onClick={() => onNovelSelect(novel)}
          >
            <div className="novel-card-header">
              <div className="novel-icon">📖</div>
              <h3 className="novel-title">{novel.title}</h3>
            </div>

            <div className="novel-card-body">
              <p className="novel-description">點擊開始閱讀這本精彩的小說</p>
              <div className="novel-meta">
                <span className="novel-format">TXT 格式</span>
                <span className="novel-status">可閱讀</span>
              </div>
            </div>

            <div className="novel-card-footer">
              <button className="read-button">開始閱讀 →</button>
            </div>
          </div>
        ))}
      </div>

      {novels.length === 0 && (
        <div className="no-novels">
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>暫無小說</h3>
            <p>請添加小說檔案到 novels 資料夾</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
