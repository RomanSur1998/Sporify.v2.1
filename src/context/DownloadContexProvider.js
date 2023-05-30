import { stringify } from "json5";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
export const downloadContext = createContext();
export const useDownLoad = () => useContext(downloadContext);
const DownloadContextProvider = ({ children }) => {
  const [downloads, setDownloads] = useState(
    JSON.parse(localStorage.getItem("downloads"))
  );
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites"))
  );
  //   !===========================
  function getDownload() {
    let downloads = JSON.parse(localStorage.getItem("downloads"));
    if (!downloads) {
      localStorage.setItem(
        "downloads",
        JSON.stringify({
          tracks: [],
        })
      );
      downloads = {
        tracks: [],
      };
    }
    setDownloads(downloads);
  }
  const checkTracksDown = (id) => {
    let downloads = JSON.parse(localStorage.getItem("downloads"));
    console.log(downloads);

    if (downloads) {
      let down = downloads.tracks.filter((elem) => elem.id == id);
      return down.length > 0 ? true : false;
    }
  };

  //   !========================
  function AddDownload(track) {
    let downloads = JSON.parse(localStorage.getItem("downloads"));
    if (!downloads) {
      downloads = { tracks: [] };
    }
    console.log(track);
    let newTrack = track;

    let productToFind = downloads.tracks.filter((elem) => elem.id === track.id);
    console.log(productToFind);
    if (productToFind.length === 0) {
      downloads.tracks.push(newTrack);
    } else {
      downloads.tracks = downloads.tracks.filter((elem) => elem.id != track.id);
    }
    localStorage.setItem("downloads", JSON.stringify(downloads));
    setDownloads(downloads);
  }
  //   ! -------------------------------------
  const deleteTrack = (id) => {
    let downloads = JSON.parse(localStorage.getItem("downloads"));

    downloads.tracks = downloads.tracks.filter((elem) => elem.id !== id);
    localStorage.setItem("downloads", JSON.stringify(downloads));
    setDownloads(downloads);
  };

  //   todo ------ Favorites-----BLock----------------
  function getFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    if (!favorites) {
      localStorage.setItem(
        "favorites",
        JSON.stringify({
          tracks: [],
        })
      );
      favorites = {
        tracks: [],
      };
    }
    setFavorites(favorites);
  }

  function AddFavorites(track) {
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    if (!favorites) {
      favorites = { tracks: [] };
    }
    console.log(track);
    let newTrack = track;
    let productToFind = favorites.tracks.filter((elem) => elem.id === track.id);
    console.log(productToFind);
    if (productToFind.length === 0) {
      favorites.tracks.push(newTrack);
    } else {
      favorites.tracks = favorites.tracks.filter((elem) => elem.id != track.id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setFavorites(favorites);
  }

  const checkTracks = (id) => {
    let favorites = JSON.parse(localStorage.getItem("favorites"));

    if (favorites) {
      let Track = favorites.tracks.filter((elem) => elem.id == id);
      return Track.length > 0 ? true : false;
    }
  };
  const deleteLikedTrack = (id) => {
    let favorites = JSON.parse(localStorage.getItem("favorites"));

    favorites.tracks = favorites.tracks.filter((elem) => elem.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setDownloads(favorites);
  };

  //   todo ------ Favorites-----BLock----------------

  const values = {
    getDownload,
    AddDownload,
    downloads,
    deleteTrack,
    getFavorites,
    AddFavorites,
    favorites,
    checkTracks,
    checkTracksDown,
    deleteLikedTrack,
  };
  return (
    <downloadContext.Provider value={values}>
      {children}
    </downloadContext.Provider>
  );
};

export default DownloadContextProvider;
