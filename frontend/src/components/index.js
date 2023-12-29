import loadable from '@loadable/component';
const MusicControls = loadable(() => import('./musicControls/MusicControls'));
const PlayCta = loadable(() => import('./playCta/PlayCta'));
const Playlist = loadable(() => import('./playlist/Playlist'));
const ProgressBar = loadable(() => import('./progressBar/ProgressBar'));
const SearchBar = loadable(() => import('./searchBar/SearchBar'));
const Song = loadable(() => import('./song/Song'));
const VolumeControl = loadable(() => import('./volumeControl/VolumeControl'));
const SoundWaves = loadable(() => import('./soundWaves/SoundWaves'));
const PlayerOptions = loadable(() => import('./playerOptions/PlayerOptions'));
const Slider = loadable(() => import('./slider/Slider'));
const CoverImage = loadable(() => import('./coverImage/CoverImage'));
const PlaylistCover = loadable(() => import('./playlistCover/PlaylistCover'));
const TextInput = loadable(() => import('./textInput/TextInput'));
const ScrollTop = loadable(() => import('./scrollTop/ScrollTop'));
const FileInput = loadable(() => import('./fileInput/FileInput'));
const Loader = loadable(() => import('./loader/Loader'));
const ConfirmPopup = loadable(() => import('./confirmPopup/ConfirmPopup'));
const ShareBtn = loadable(() => import('./shareBtn/ShareBtn'));
const Logo = loadable(() => import('./logo/Logo'));

export {
    MusicControls,
    PlayCta,
    Playlist,
    ProgressBar,
    SearchBar,
    Song,
    VolumeControl,
    SoundWaves,
    PlayerOptions,
    Slider,
    CoverImage,
    PlaylistCover,
    TextInput,
    ScrollTop,
    FileInput,
    Loader,
    ConfirmPopup,
    ShareBtn,
    Logo
}
