import { Fragment, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import axiosInstance from "../../redux/axiosInstance";
import Playlist from "../../components/Playlist";
import styles from "./styles.module.scss";

const Home = () => {
    const [firstPlaylists, setFirstPlaylists] = useState([]);
    const [secondPlaylists, setSecondPlaylists] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const getRandomPlaylists = async () => {
        try {
            setIsFetching(true);
            const url = `${process.env.REACT_APP_API_URL}/playlists/random`;
            const { data } = await axiosInstance.get(url);
            const array1 = data.data.slice(0, 4); // Use slice to create arrays
            const array2 = data.data.slice(4);
            setFirstPlaylists(array1);
            setSecondPlaylists(array2);
            setIsFetching(false);
        } catch (error) {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        getRandomPlaylists();
    }, []);

    return (
        <Fragment>
            {isFetching ? (
                <div className={styles.progress_container}>
                    <CircularProgress style={{ color: "#1ed760" }} size="5rem" />
                </div>
            ) : (
                <div className={styles.container}>
                    <h1>Welcome</h1>
                    <div className={styles.playlists_container}>
                        <Playlist playlists={firstPlaylists} />
                    </div>
                    <h1>Just the hits</h1>
                    <div className={styles.playlists_container}>
                        <Playlist playlists={secondPlaylists} />
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Home;
