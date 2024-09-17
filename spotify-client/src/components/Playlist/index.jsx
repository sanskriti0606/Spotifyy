import { Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const Playlist = ({ playlists }) => {
    return (
        <Fragment>
            {playlists.map((playlist) => (
                <Link key={playlist._id} to={`/playlist/${playlist._id}`} className={styles.playlist}>
                    <div className={styles.playlist_image_container}>
                        <img
                            src={playlist.img || "https://static.thenounproject.com/png/17849-200.png"}
                            alt={playlist.name}
                            className={styles.playlist_image}
                        />
                    </div>
                    <p className={styles.playlist_name}>{playlist.name}</p>
                    <span className={styles.playlist_desc}>{playlist.desc}</span>
                </Link>
            ))}
        </Fragment>
    );
};

export default Playlist;
