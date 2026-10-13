import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { useParams } from "react-router-dom";
import { db } from "../../services/firebase/firebaseClient.js";
import useUserStore from "../../stores/userStore.js";

function Like() {
  const { companyId } = useParams();
  const [like, setLike] = useState("");
  const [favoriteData, setFavoriteData] = useState({});
  const userId = useUserStore((state) => state.userId);
  const favoriteq = query(
    collection(db, "favorite"),
    where("userId", "==", userId),
    where("companyId", "==", companyId),
  );
  const companyq = query(
    collection(db, "favorite"),
    where("companyId", "==", companyId),
  );

  useEffect(() => {
    if (userId) {
      getDocs(favoriteq)
        .then((quarySnaps) => {
          let favorites = [];
          quarySnaps.forEach((doc) => {
            const result = doc.data();
            const resultId = doc.id;
            const combineResult = { ...result, favoriteId: resultId };
            favorites.push(combineResult);
          });

          const IdSource = favorites[0];
          return IdSource;
        })
        .then((IdSource) => {
          setFavoriteData(IdSource);
        });

      onSnapshot(favoriteq, (querySnapshot) => {
        let favorites = [];
        querySnapshot.forEach((doc) => {
          favorites.push(doc.data().status);
        });
        setLike(favorites[0]);
      });

      onSnapshot(companyq, (querySnapshot) => {
        let totals = [];
        querySnapshot.forEach((doc) => {
          totals.push(doc.data().status);
        });
      });
    }
  }, [userId]);

  const handleLike = async (change) => {
    const favoriteRef = doc(db, "favorite", favoriteData.favoriteId);
    await updateDoc(favoriteRef, {
      status: change,
    });
  };

  return (
    <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
      <div className="mr-1">
        <IconContext.Provider value={{ size: "30px" }}>
          {like === "like" ? (
            <HiThumbUp onClick={() => handleLike("eaten")} />
          ) : (
            <HiOutlineThumbUp onClick={(e) => handleLike("like")} />
          )}
        </IconContext.Provider>
      </div>
      <p className="mr-1">|</p>
      <IconContext.Provider value={{ size: "30px" }}>
        {like === "dislike" ? (
          <HiThumbDown onClick={(e) => handleLike("eaten")} />
        ) : (
          <HiOutlineThumbDown onClick={(e) => handleLike("dislike")} />
        )}
      </IconContext.Provider>
    </div>
  );
}

export default Like;
