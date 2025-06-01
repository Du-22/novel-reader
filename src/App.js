import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChapterList from "./components/ChapterList";
import ReadingArea from "./components/ReadingArea";
import "./App.css";

// 🔧 完整的修正版章節解析器 - 移除數字點格式

// 🔧 完整的修正版章節解析器 - 包含更安全的混合模式

// 🔧 診斷版章節解析器 - 找出問題根源

const CHAPTER_PATTERNS = [
  { pattern: /^Chapter\s+\d+.*$/gm, name: "English Chapter" },
  { pattern: /^第\s*\d{3,}\s*[章話集節].*$/gm, name: "中文補零章節" },

  // 中文數字格式（章、話、集、節）
  {
    pattern:
      /^第\s*[一二三四五六七八九十百千萬億兆零壹貳參肆伍陸柒捌玖拾佰仟]+\s*[章話集節].*$/gm,
    name: "中文漢字章節",
  },

  // 阿拉伯數字格式（章、話、集、節）
  { pattern: /^第\s*\d+\s*[章話集節].*$/gm, name: "中文數字章節" },

  // 符號+數字格式
  {
    pattern: /^[◆●○▲△▼▽■□★☆♠♣♥♦※◇◈⚫⚪🔴🔵⭐]\s*\d+.*$/gm,
    name: "符號數字章節",
  },

  // 🔧 修正方括號格式 - 必須以「第」開頭且有數字
  {
    pattern:
      /^\[\s*第\s*[一二三四五六七八九十百千萬億兆零壹貳參肆伍陸柒捌玖拾佰仟\d]+\s*[章話集節].*?\].*$/gm,
    name: "方括號章節",
  },

  // 🔧 修正中括號格式 - 必須以「第」開頭且有數字
  {
    pattern:
      /^【\s*第\s*[一二三四五六七八九十百千萬億兆零壹貳參肆伍陸柒捌玖拾佰仟\d]+\s*[章話集節].*?】.*$/gm,
    name: "中括號章節",
  },

  // 🔧 暫時註解掉可疑的模式，逐一測試
  // { pattern: /^<[^>]*第\s*[一二三四五六七八九十百千萬億兆零壹貳參肆伍陸柒捌玖拾佰仟\d]+\s*[章話集節][^>]*>$/gm, name: "尖括號章節" },

  // 🔧 暫時註解掉混合模式
  // { pattern: /^.{0,20}第\s*[一二三四五六七八九十百千萬億兆零壹貳參肆伍陸柒捌玖拾佰仟\d]+\s*[章話集節].{0,20}$/gm, name: "限制長度混合章節" },
];

// 🔧 修正版解析函數
const parseChapters = (content) => {
  console.log("開始修正版章節解析...");

  // 🔧 第一步：找出所有章節位置和內容
  const allChapterMarkers = [];

  for (const { pattern, name } of CHAPTER_PATTERNS) {
    const regex = new RegExp(pattern.source, "gm");
    let match;

    while ((match = regex.exec(content)) !== null) {
      allChapterMarkers.push({
        title: match[0].trim(),
        position: match.index,
        pattern: name,
        length: match[0].length,
      });
    }
  }

  if (allChapterMarkers.length === 0) {
    console.log("沒有找到任何章節標記");
    return tryParagraphSplit(content);
  }

  // 🔧 第二步：按位置排序（保持原文順序）
  allChapterMarkers.sort((a, b) => a.position - b.position);

  // 🔧 第三步：移除重複和重疊的標記
  const uniqueMarkers = removeDuplicateMarkers(allChapterMarkers);

  console.log(`找到 ${uniqueMarkers.length} 個唯一章節標記`);
  uniqueMarkers.forEach((marker, index) => {
    console.log(`${index + 1}. ${marker.title} (位置: ${marker.position})`);
  });

  // 🔧 第四步：提取章節內容
  const chapters = [];

  for (let i = 0; i < uniqueMarkers.length; i++) {
    const currentMarker = uniqueMarkers[i];
    const nextMarker = uniqueMarkers[i + 1];

    // 計算內容起始位置（章節標題後）
    const contentStart = currentMarker.position + currentMarker.length;

    // 計算內容結束位置
    const contentEnd = nextMarker ? nextMarker.position : content.length;

    // 提取內容
    const chapterContent = content.slice(contentStart, contentEnd).trim();

    if (chapterContent.length > 20) {
      chapters.push({
        title: currentMarker.title,
        content: chapterContent,
      });
    }
  }

  if (chapters.length > 0) {
    console.log(`✅ 成功解析 ${chapters.length} 個章節，順序正確`);
    return {
      success: true,
      chapters: chapters,
      format: "混合格式（按位置排序）",
    };
  }

  return tryParagraphSplit(content);
};

// 🔧 移除重複和重疊標記的函數
const removeDuplicateMarkers = (markers) => {
  const uniqueMarkers = [];
  const usedPositions = new Set();

  for (const marker of markers) {
    // 檢查是否與已有標記重疊
    let isOverlapping = false;

    for (const usedPos of usedPositions) {
      // 如果位置太接近（小於10個字元），視為重疊
      if (Math.abs(marker.position - usedPos) < 10) {
        isOverlapping = true;
        break;
      }
    }

    if (!isOverlapping) {
      uniqueMarkers.push(marker);
      usedPositions.add(marker.position);
    }
  }

  return uniqueMarkers;
};

// 🔧 保持原本的 tryParagraphSplit 函數
const tryParagraphSplit = (content) => {
  const paragraphs = content
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 50);

  if (paragraphs.length > 1) {
    const chapters = paragraphs.map((paragraph, index) => ({
      title: `段落 ${index + 1}`,
      content: paragraph.trim(),
    }));

    console.log(`按段落分割成 ${chapters.length} 個部分`);
    return {
      success: true,
      chapters: chapters,
      format: "段落分割",
    };
  }

  return {
    success: true,
    chapters: [
      {
        title: "全文",
        content: content.trim(),
      },
    ],
    format: "單一文檔",
  };
};

const App = () => {
  // 🔧 狀態管理
  const [currentNovel, setCurrentNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [novels, setNovels] = useState([]); // 動態小說列表

  // 🔧 自動掃描小說檔案（修正版）
  const scanNovels = async () => {
    console.log("開始掃描小說檔案...");

    // 🔧 回到簡單可用的版本
    const novelFiles = [
      "Pick me up.txt",
      "為智慧文明生活而來.txt",
      "與神一同升級.txt",
      "成為塔防遊戲裡的暴君.txt",
      "擁抱星星的劍士.txt",
      "轉生25年的冒險者成為了學院教官.txt",
      // 添加更多檔案名稱...
    ];

    const availableNovels = [];

    for (let i = 0; i < novelFiles.length; i++) {
      const fileName = novelFiles[i];
      const filePath = `/novels/${fileName}`;

      try {
        // 🔧 修正：實際讀取內容來判斷檔案是否存在
        const response = await fetch(filePath);

        if (response.ok) {
          const content = await response.text();

          // 🔧 檢查是否是 HTML 內容（表示是 index.html）
          if (
            content.includes("<!DOCTYPE html>") ||
            content.includes("<html")
          ) {
            console.log(`檔案不存在（返回 HTML）: ${fileName}`);
            continue; // 跳過這個檔案
          }

          // 🔧 檢查是否是有效的文字內容
          if (content.trim().length < 50) {
            console.log(`檔案內容太短，可能無效: ${fileName}`);
            continue;
          }

          const title = fileName
            .replace(".txt", "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          availableNovels.push({
            id: i + 1,
            title: title,
            file: filePath,
            fileName: fileName,
          });

          console.log(`找到小說: ${title} (${fileName})`);
        } else {
          console.log(`檔案載入失敗: ${fileName} (${response.status})`);
        }
      } catch (error) {
        console.log(`檔案讀取錯誤: ${fileName}`, error.message);
      }
    }

    if (availableNovels.length === 0) {
      console.warn(
        "沒有找到任何小說檔案！請確認 public/novels/ 資料夾中有 .txt 檔案"
      );
      setNovels([
        {
          id: 1,
          title: "找不到小說檔案 - 請檢查 novels 資料夾",
          file: "",
          fileName: "",
        },
      ]);
    } else {
      console.log(`共找到 ${availableNovels.length} 本小說`);
      setNovels(availableNovels);
    }
  };

  // 🔧 組件載入時自動掃描
  useEffect(() => {
    scanNovels();
  }, []);

  // 🔖 書籤相關函數
  const saveBookmark = (novelId, chapterIndex) => {
    const bookmark = {
      novelId: novelId,
      chapterIndex: chapterIndex,
      timestamp: new Date().toISOString(),
      novelTitle: currentNovel?.title || "",
    };

    try {
      localStorage.setItem(`bookmark_${novelId}`, JSON.stringify(bookmark));
      console.log(
        `書籤已儲存: ${currentNovel?.title} - 第 ${chapterIndex + 1} 章`
      );
    } catch (error) {
      console.error("儲存書籤失敗:", error);
    }
  };

  const loadBookmark = (novelId) => {
    try {
      const bookmarkData = localStorage.getItem(`bookmark_${novelId}`);
      if (bookmarkData) {
        return JSON.parse(bookmarkData);
      }
    } catch (error) {
      console.error("讀取書籤失敗:", error);
    }
    return null;
  };

  const getLastReadNovel = () => {
    try {
      const lastRead = localStorage.getItem("lastReadNovel");
      if (lastRead) {
        const data = JSON.parse(lastRead);
        return novels.find((novel) => novel.id === data.novelId);
      }
    } catch (error) {
      console.error("讀取最後閱讀小說失敗:", error);
    }
    return null;
  };

  const saveLastReadNovel = (novelId) => {
    try {
      localStorage.setItem(
        "lastReadNovel",
        JSON.stringify({
          novelId: novelId,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("儲存最後閱讀小說失敗:", error);
    }
  };

  // 🔖 頁面載入時自動恢復上次閱讀狀態
  useEffect(() => {
    if (novels.length > 0) {
      const lastNovel = getLastReadNovel();
      if (lastNovel) {
        console.log("發現上次閱讀記錄，自動載入...", lastNovel.title);
        loadNovel(lastNovel, true);
      }
    }
  }, [novels]); // 等小說列表載入完成後執行

  // 🔖 當章節改變時自動儲存書籤
  useEffect(() => {
    if (currentNovel && chapters.length > 0) {
      saveBookmark(currentNovel.id, currentChapter);
    }
  }, [currentNovel, currentChapter, chapters.length]);

  // 🔧 載入小說檔案的函數（彈性章節解析版本）
  const loadNovel = async (novel, isAutoRestore = false) => {
    setLoading(true);
    try {
      const response = await fetch(novel.file);

      if (!response.ok) {
        throw new Error(`無法載入檔案: ${response.status}`);
      }

      const content = await response.text();

      // 使用彈性章節解析
      const parseResult = parseChapters(content);

      if (!parseResult.success || parseResult.chapters.length === 0) {
        throw new Error("無法解析小說內容，請檢查檔案格式");
      }

      console.log(`使用 ${parseResult.format} 格式解析完成`);

      setChapters(parseResult.chapters);
      setCurrentNovel(novel);

      // 恢復書籤位置
      let startChapter = 0;
      if (isAutoRestore) {
        const bookmark = loadBookmark(novel.id);
        if (bookmark && bookmark.chapterIndex < parseResult.chapters.length) {
          startChapter = bookmark.chapterIndex;
          console.log(`恢復書籤: 第 ${startChapter + 1} 章`);
        }
      }

      setCurrentChapter(startChapter);
      saveLastReadNovel(novel.id);

      console.log(
        `成功載入 ${novel.title}，共 ${parseResult.chapters.length} 章`
      );

      // 手動選擇時的書籤提示
      if (!isAutoRestore) {
        const bookmark = loadBookmark(novel.id);
        if (bookmark && bookmark.chapterIndex > 0) {
          const shouldRestore = window.confirm(
            `發現此小說的閱讀記錄（第 ${
              bookmark.chapterIndex + 1
            } 章），是否要跳轉到上次閱讀位置？`
          );
          if (
            shouldRestore &&
            bookmark.chapterIndex < parseResult.chapters.length
          ) {
            setCurrentChapter(bookmark.chapterIndex);
          }
        }
      }
    } catch (error) {
      console.error("載入小說失敗:", error);
      alert(`載入失敗：${error.message}`);
    }
    setLoading(false);
  };

  // 選擇章節的函數
  const handleChapterSelect = (chapterIndex) => {
    setCurrentChapter(chapterIndex);
  };

  // 下一章的函數
  const handleNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  // 上一章的函數
  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  return (
    <div className="app">
      {/* 上方標題列 */}
      <Header
        currentNovel={currentNovel}
        onNovelSelect={loadNovel}
        novels={novels}
      />

      {/* 主要內容區域 */}
      <div className="main-content">
        {/* 只有選擇小說後才顯示章節列表 */}
        {currentNovel && (
          <ChapterList
            chapters={chapters}
            currentChapter={currentChapter}
            onChapterSelect={handleChapterSelect}
          />
        )}

        {/* 閱讀區域 */}
        <ReadingArea
          chapter={chapters[currentChapter]}
          currentChapter={currentChapter}
          totalChapters={chapters.length}
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
        />
      </div>

      {/* 載入提示 */}
      {loading && <div className="loading">載入中...</div>}
    </div>
  );
};

export default App;
