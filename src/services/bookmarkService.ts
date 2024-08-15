export interface Bookmark {
    id: string;
    title: string;
    url?: string;
    children?: Bookmark[];
  }
  
  export const getBookmarks = (): Promise<Bookmark[]> => {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree((results) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(results);
        }
      });
    });
  };
  
  export const createBookmark = (
    parentId: string,
    title: string,
    url?: string
  ): Promise<Bookmark> => {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.create({ parentId, title, url }, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  };
  
  export const updateBookmark = (
    id: string,
    changes: { title?: string; url?: string }
  ): Promise<Bookmark> => {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.update(id, changes, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  };
  
  export const deleteBookmark = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.remove(id, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  };