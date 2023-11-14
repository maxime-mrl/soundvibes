import { useContext } from "react";
import Datactx from "../../context/DataContext";

export default function CoverImage() {
    const { music:{id, name} } = useContext(Datactx);
    return (
        <img src={`http://localhost:80/public/${id}/cover.jpg`} alt={`Album cover for ${name} song`} className="cover-img" />
    )
}
