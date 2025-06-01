import React, { useEffect, useRef } from "react";

const ReadingArea = ({
  chapter,
  currentChapter,
  totalChapters,
  onNextChapter,
  onPrevChapter,
}) => {
  // 🔧 使用 ref 來控制滾動位置
  const readingAreaRef = useRef(null);

  // 🔧 當章節改變時，自動滾動到頂部
  useEffect(() => {
    if (readingAreaRef.current) {
      // 嘗試多種滾動方式確保有效
      readingAreaRef.current.scrollTop = 0;
      readingAreaRef.current.scrollTo(0, 0);

      // 如果上面的方法無效，也嘗試滾動整個視窗
      window.scrollTo(0, 0);
    }
  }, [currentChapter]); // 監聽 currentChapter 變化

  // 如果沒有章節資料，顯示提示訊息
  if (!chapter) {
    return (
      <main className="reading-area" ref={readingAreaRef}>
        <div className="no-content">請選擇小說和章節</div>
      </main>
    );
  }

  return (
    <main className="reading-area" ref={readingAreaRef}>
      {/* 章節資訊 */}
      <div className="chapter-info">
        第 {currentChapter + 1} 章 / 共 {totalChapters} 章
      </div>

      {/* 章節內容 */}
      <div className="chapter-content">
        <h2 className="chapter-title-display">{chapter.title}</h2>
        <div className="text-content">
          {chapter.content
            .split("\n")
            .map(
              (paragraph, index) =>
                paragraph.trim() && <p key={index}>{paragraph}</p>
            )}
        </div>
      </div>

      {/* 導航按鈕 */}
      <div className="navigation-buttons">
        <button
          onClick={onPrevChapter}
          disabled={currentChapter === 0}
          className="nav-button prev"
        >
          ← 上一章
        </button>
        <button
          onClick={onNextChapter}
          disabled={currentChapter === totalChapters - 1}
          className="nav-button next"
        >
          下一章 →
        </button>
      </div>
    </main>
  );
};

export default ReadingArea;
