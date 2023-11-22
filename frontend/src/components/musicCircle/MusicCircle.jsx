import { useContext, useEffect, useRef } from "react";
import Datactx from "../../context/DataContext";
import "./MusicCircle.css";

export default function MusicCircle() {  
        const canvasRef = useRef(null);
        const memory = useRef({ analyser: null, audioCtx: null, sourceNode: null, memId: null });
        const animationId = useRef();
        const timeoutId = useRef();
        const { music:{audio, isPlaying, id, isLoading} } = useContext(Datactx);
        
        function renderFrame(ctx, analyser, interval) {
            let dataArray = new Uint8Array(analyser.frequencyBinCount);
            const canvas = ctx.canvas;
            // update canvas size to screen
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight; 
            // determinate the max size
            let maxSize = Math.min(canvas.width, canvas.height);
            // go to the center
            ctx.translate(canvas.width/2, canvas.height/2);

            // update position of each point
            analyser.getByteFrequencyData(dataArray);
            let { audiopos, avg} = pointcleanup(dataArray, interval);

            // draw everything
            ctx.lineWidth = 3;
            ctx.lineJoin = "round";
            ctx.miterlimit = 100;
            ctx.filter = "blur(3px)";
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text');
            for (let i = 0; i < 6; i++) {
                draw(ctx, audiopos, {
                    size: 0.3 - (i*0.001),
                    rotate: i,
                    dampening: (avg-70)/100,
                    maxSize
                });
            }
        }

        function pointcleanup(points, interval) {
            points = Array.from(points);
            let realAvg = points.reduce((prev, current) => prev + current) / points.length; // https://www.slingacademy.com/article/javascript-ways-to-find-the-mean-average-of-an-array/
            let avg = realAvg < 80 ? 80 : realAvg; // don't allow small circle 
            let positions = [];
            points.forEach(pos => {
                if (pos > 0) {
                    if (realAvg < 80) pos += 80-realAvg;
                    if (pos > avg - interval && pos < avg + 2*interval) positions.push(pos);
                }
            });
            if (positions.length < 30) {
                for (let i = 0; i <= 15 - positions.length; i++) positions.push(avg + Math.random()*10);
            }
            return {
                audiopos: positions.concat(positions.slice().reverse()),
                avg: avg
            };
        }

        function draw(ctx, pos, params) {
            ctx.rotate(params.rotate*Math.PI/180);
            ctx.beginPath();
            pos.forEach((distance, i) => {
                distance = distance/200;
                ctx.save();
                ctx.rotate(i * Math.PI/(pos.length/2));
                // ctx.fillRect(canvas.width*0.4*distance, 0, 10, 10)
                const point = ((params.maxSize*distance) * (params.dampening+0.5) + params.maxSize*(1-(params.dampening+0.3)*0.5))*params.size
                // const point = (params.maxSize*distance) * (params.size+0.3)
                ctx.lineTo(point, 0);
                ctx.restore();
            })
            ctx.closePath();
            ctx.stroke();
        }
        
        useEffect(() => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            let {
                analyser,
                audioCtx,
                sourceNode,
                memId
            } = memory.current
            let interval = 50;

            // create the analyser to handle the visualization data
            if (audio && isPlaying && !isLoading && (!audioCtx || memId !== id)) {
                audioCtx = new AudioContext();
                console.log(audioCtx)
                analyser = audioCtx.createAnalyser();
                analyser.connect(audioCtx.destination);
                analyser.fftSize = 256; // power of 2 only - the higher it is the more resolution there is for the visualization
                // connect the analyser to the audio
                if (sourceNode) sourceNode.disconnect();
                sourceNode = audioCtx.createMediaElementSource(audio);
                sourceNode.connect(analyser);
                memory.current = { analyser, audioCtx, sourceNode, memId: id }
                if (animationId.current) window.cancelAnimationFrame(animationId.current)
                if (timeoutId.current) clearTimeout(timeoutId.current);
                render()
            }

            function render() {
                renderFrame(context, analyser, interval)
                timeoutId.current = setTimeout(() => {
                    animationId.current = window.requestAnimationFrame(render)
                }, interval);
            }

            return () => {
                console.log(sourceNode)
                if (sourceNode) sourceNode.disconnect()
                memory.current = { analyser: null, audioCtx: null, sourceNode: null, memId: null }
                window.cancelAnimationFrame(animationId.current)
            }
        }, [audio, id, isPlaying, isLoading])
    return (
        <canvas className="circle-bg" ref={canvasRef}></canvas>
    )
}
