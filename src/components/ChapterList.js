import React from "react";

const ChapterList = ({ chapters, currentChapter, onChapterSelect }) => {
  return (
    <aside className="chapter-list">
      <h3>章節目錄</h3>
      <div className="chapter-items">
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className={`chapter-item ${
              currentChapter === index ? "active" : ""
            }`}
            onClick={() => onChapterSelect(index)}
          >
            第 {index + 1} 章
            {chapter.title && (
              <span className="chapter-title">：{chapter.title}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChapterList;
