import React from 'react';
import crypto from "crypto";
import QRCode from "qrcode";

class Point {
    x: number;
    y: number;
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }
}
class queueNode {
    pt: Point;
    dist: number;
    constructor(_pt: Point, _dist: number) {
        this.pt = _pt;
        this.dist = _dist;
    }
}

export function pathLengthCalculator({hashUrlStr}:{hashUrlStr:string}) {
    let dots: number[][] = [];
    let portalPoints: Point[] = [];
    let pathLength:number = 0;

    const opt: QRCode.QRCodeToStringOptions &
        QRCode.QRCodeToDataURLOptions &
        QRCode.QRCodeRenderersOptions = {
        errorCorrectionLevel: "H",
        margin: 0,
        scale: 1,
        width: 1,
        color: { dark: "#00000000", light: "#000000ff" },
    };

    QRCode.toCanvas(hashUrlStr, opt, function (err, canvas) {
        const context = canvas.getContext("2d");
        const imgData = context?.getImageData(0, 0, canvas.width, canvas.height);
        if (imgData) {
            const data = imgData.data;
            const width = imgData.width;
            const height = imgData.height;

            for (let y = 0; y < height; y++) {
            const rowDots: number[] = [];

            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                rowDots.push(r + g + b + a);
            }
            dots.push(rowDots);
            }
        }
    });
    
    if (dots.length) {
        portalPoints = searchPoints(dots);
        if (portalPoints.length){
            let res = searchLongestBFS(dots, portalPoints);
            portalPoints = res.pts;
            pathLength = res.dist;
            console.log("FROM :", portalPoints[0]);
            console.log("TO :", portalPoints[1]);
            console.log("DISTANCE:", pathLength);
        }
    }
    let fromP:number[] = [portalPoints[0].x, portalPoints[0].y];
    let toP:number[] = [portalPoints[1].x, portalPoints[1].y];
    return {from: fromP, to: toP, len: pathLength};
}

/**
 * 
 * @param seedString seedString
 * @returns string hex
 */        
export function hashUrlMaker({seedString}:{seedString:string}):string {
  let hashStr = crypto.createHash("sha256").update(seedString).digest("hex");

  return `https://block-chain.kr/${hashStr}`;
}

function BFS(dots: number[][], src: Point, dest: Point) {
    if (dots[src.x][src.y] === dots[0][0] || dots[dest.x][dest.y] === dots[0][0]) return -1;
    let ROW = dots.length;
    let COL = dots.length;

    let visited = new Array(ROW)
    .fill(false)
    .map(() => new Array(COL).fill(false));

    visited[src.x][src.y] = true;

    let q: queueNode[] = [];

    let s = new queueNode(src, 0);
    q.push(s);

    function isValid(row: number, col: number) {
        return row >= 0 && row < ROW && col >= 0 && col < COL;
    }

    let rowNum = [-1, 0, 0, 1];
    let colNum = [0, -1, 1, 0];

    while (q) {
        let curr = q.shift();
        if (!curr) return;
        let pt = curr.pt;
        if (!pt) return;
        if (pt.x === dest.x && pt.y === dest.y) return curr.dist;

        for (let i = 0; i < 4; i++) {
            let row = pt.x + rowNum[i];
            let col = pt.y + colNum[i];

            if (isValid(row, col) && dots[row][col] === 255 && !visited[row][col]) {
                visited[row][col] = true;
                let Adjcell = new queueNode(new Point(row, col), curr.dist + 1);
                q.push(Adjcell);
            }
        }
    }
    return -1;
}

function searchLongestBFS(dots:number[][], portalPoints: Point[]) {
    let points: Point[] = [portalPoints[0], portalPoints[1]];
    let tmp = BFS(dots, points[0], points[1]);
    let distance:number;
    if(tmp) distance = tmp;
    else distance = 0;

    for (let i = 0; i < portalPoints.length; i++) {
        for (let j = 2; j < portalPoints.length; j++) {
            let curr_dist = BFS(dots, portalPoints[i], portalPoints[j]);
            if (!curr_dist) continue;
            if (curr_dist > distance) {
                distance = curr_dist;
                points = [portalPoints[i], portalPoints[j]];
            }
        }
    }
    // console.log("searchLongestBFS");
    // console.log(points);
    // console.log(distance);
    if (!distance) return {pts:points, dist:-1};
    return {pts:points, dist:distance};
}

function searchPoints(qrMap: number[][]) {
    // length of squre at edge.
    let sqlen=0;
    while(qrMap[0][0] == qrMap[sqlen][0]) sqlen++;
    let block = qrMap[0][0];

    let resPoints:Point[] = [];
    for (let index = 0; index < qrMap.length - sqlen; index++) {
    if (block !== qrMap[0][index]) {
        resPoints.push(new Point(0, index));
    }
    if (block !== qrMap[index][0]) resPoints.push(new Point(index, 0));
    if (block !== qrMap[index][qrMap.length - 1])
    resPoints.push(new Point(index, qrMap.length - 1));
    if (block !== qrMap[qrMap.length - 1][index])
    resPoints.push(new Point(qrMap.length - 1, index));
    }
    resPoints.sort((a, b) => a.x - b.x);
    // console.log("resPoints");
    // console.log(resPoints);
    return resPoints;
}