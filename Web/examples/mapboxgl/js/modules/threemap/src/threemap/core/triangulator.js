function Triangulator() {

}

Object.assign(Triangulator.prototype, {

    process: function (contour) {
        var Indexs = [];

        var nCount = contour.length;
        if (nCount > 3) {
            var first = contour[0];
            var last = contour[nCount - 1];
            if (first.x == last.x && first.y == last.y) {
                nCount--;
            }
        }

        var n = nCount;
        if (n < 3)
            return null;

        var V = [];
        V.length = n;

        if (0.0 < this.area(contour))
            for (var v=0; v<n; v++) V[v] = v;
        else
            for(var v=0; v<n; v++) V[v] = (n-1)-v;

        var nv = n;
        var count = 2*nv;

        for (var m = 0, v = nv-1; nv > 2; ) {
            /* if we loop, it is probably a non-simple polygon */
            if (0 >= (count--)) {
                //** Triangulate: ERROR - probable bad polygon!
                return null;
            }

            /* three consecutive vertices in current polygon, <u,v,w> */
            var u = v; if (nv <= u) u = 0;     /* previous */
            v = u+1; if (nv <= v) v = 0;     /* new v    */
            var w = v+1; if (nv <= w) w = 0;     /* next     */

            if (this.snip(contour, u, v, w, nv, V)) {
                var a,b,c,s,t;

                /* true names of the vertices */
                a = V[u]; b = V[v]; c = V[w];

                /* output Triangle */
                Indexs.push( a );
                Indexs.push( b );
                Indexs.push( c );

                m++;

                /* remove v from remaining polygon */
                for(s=v,t=v+1;t<nv;s++,t++) V[s] = V[t]; nv--;

                /* resest error detection counter */
                count = 2*nv;
            }
        }
        return Indexs;
    },

    snip: function (contour, u, v, w, n, V) {
        var p;
        var Ax, Ay, Bx, By, Cx, Cy, Px, Py;

        Ax = contour[V[u]].x;
        Ay = contour[V[u]].y;

        Bx = contour[V[v]].x;
        By = contour[V[v]].y;

        Cx = contour[V[w]].x;
        Cy = contour[V[w]].y;

        if (1e-13 > (((Bx-Ax)*(Cy-Ay)) - ((By-Ay)*(Cx-Ax))))
            return false;

        for (p=0;p<n;p++)
        {
            if ((p == u) || (p == v) || (p == w))
                continue;

            Px = contour[V[p]].x;
            Py = contour[V[p]].y;

            if (this.insideTriangle(Ax,Ay,Bx,By,Cx,Cy,Px,Py))
                return false;
        }

        return true;
    },

    area: function (contour) {
        var A = 0.0;
        var count = contour.length;
        for (var p = count - 1, q = 0; q < count; p = q++)
        {
            A += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
        }
        return A*0.5;
    },

    insideTriangle: function (Ax, Ay, Bx, By, Cx, Cy, Px, Py) {
        var bResult = (Cx - Bx)*(Py - By) < (Cy - By)*(Px - Bx)
            || (Bx - Ax)*(Py - Ay) < (By - Ay)*(Px - Ax)
            || (Ax - Cx)*(Py - Cy) < (Ay - Cy)*(Px - Cx);
        return !bResult;
    },

} );

export { Triangulator };
