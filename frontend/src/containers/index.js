import loadable from '@loadable/component';

const AddPlaylist = loadable(() => import('./addPlaylist/AddPlaylist'));
const NavBar = loadable(() => import('./navBar/NavBar'));
const Player = loadable(() => import('./player/Player'));
const SongList = loadable(() => import('./songList/SongList'));
const AddMusic = loadable(() => import('./addMusic/AddMusic'));
const DeleteMusic = loadable(() => import('./deleteMusic/DeleteMusic'));
const SetRight = loadable(() => import('./setRight/SetRight'));
const UserHistory = loadable(() => import('./userHistory/UserHistory'));
const UserPlaylist = loadable(() => import('./userPlaylist/UserPlaylist'));

export {
    AddPlaylist,
    NavBar,
    Player,
    SongList,
    AddMusic,
    DeleteMusic,
    SetRight,
    UserHistory,
    UserPlaylist
};
