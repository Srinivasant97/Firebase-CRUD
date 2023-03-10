import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { app, database } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [name, setName] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [age, setAge] = useState("");
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const databaseRef = collection(database, "CRUD");

  const submitData = (e) => {
    e.preventDefault();
    if (!update) {
      addDoc(databaseRef, {
        name: name,
        age: age,
      }).then(() => {
        alert("Data Sent");
        getStudentData();
        setName("");
        setAge("");
      });
    } else {
      let updateDataDoc = doc(database, "CRUD", updateId);
      updateDoc(updateDataDoc, {
        name: name,
        age: Number(age),
      })
        .then(() => {
          alert("Data Updated");
          getStudentData();
          setName("");
          setAge("");
          setUpdate(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    getStudentData();
  }, []);

  const getStudentData = async () => {
    const response = await getDocs(databaseRef);
    const setData = response.docs.map((data) => {
      return { ...data.data(), id: data.id };
    });
    setStudentData((prevStudentData) => {
      return [...setData];
    });
  };

  const updateData = (data) => {
    setName(data.name);
    setAge(data.age);
    setUpdateId(data.id);
    setUpdate(true);
  };
  const deleteData = (id) => {
    let deleteDataDoc = doc(database, "CRUD", id);
    deleteDoc(deleteDataDoc)
      .then(() => {
        alert("Data Deleted");
        getStudentData();
      })
      .catch((err) => {
        alert("Something Went Wrong");
      });
  };

  return (
    <>
      <Head>
        <title>Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Home</h1>
        <div>
          <form onSubmit={submitData} className="login">
            <div className="input-group flex-nowrap my-1 auto-width">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group flex-nowrap my-1 auto-width">
              <input
                type="number"
                className="form-control"
                placeholder="Age"
                aria-label="Email"
                aria-describedby="addon-wrapping"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary my-1 auto-width">
              {update ? "Update" : "Add"}
            </button>
          </form>
          <div style={{ "margin-top": "20px" }}>
            {studentData.map((data) => {
              return (
                <div
                  key={data.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className={styles.detailsContainer}>
                    <h3>Name: {data.name}</h3>
                    <span>Age: {data.age}</span>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary my-1 auto-width"
                    style={{ marginLeft: "15px" }}
                    onClick={() => updateData(data)}
                  >
                    Update
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger my-1 auto-width"
                    style={{ marginLeft: "15px" }}
                    onClick={() => deleteData(data.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
