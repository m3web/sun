function deltaTransformPoint(matrix, point)  {

    var dx = point.x * matrix.a + point.y * matrix.c + 0;
    var dy = point.x * matrix.b + point.y * matrix.d + 0;
    return { x: dx, y: dy };
}


function decomposeMatrix(matrix) {

    // @see https://gist.github.com/2052247

    // calculate delta transform point
    var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
    var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

    // calculate skew
    var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
    var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

    return {
        translateX: matrix.e,
        translateY: matrix.f,
        scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
        scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
        skewX: skewX,
        skewY: skewY,
        rotation: skewX // rotation is the same as skew x
    };
}

function showInfo(el, desc) {
    var bbox = el.getBBox();
    var svg = document.querySelector(".b-active__area svg");
    var pattern = svg.querySelector('#pattern');
    var g = svg.querySelector('#g-output');
    var newEl = el.cloneNode(true);
    var m = decomposeMatrix(newEl.getCTM());
    var scaleFactor = 250.0 / Math.max(bbox.width, bbox.height);

    g.innerHTML = '';

    pattern.setAttribute('patternTransform', 'scale(' + (1.0 / scaleFactor) + ')');

    newEl.setAttribute('id', el.getAttribute('id') + '_thumbnail');
    newEl.setAttribute('fill', 'url(#pattern)');
    g.setAttribute('transform', 'translate(' + (-bbox.x * scaleFactor) + ', ' + (-bbox.y * scaleFactor) + ')');// + ' scale(1)');

    g.setAttribute('stroke', '#fff');
    g.setAttribute('stroke-width', '1px');
    newEl.setAttribute('transform', 'scale(' + scaleFactor + ', ' + scaleFactor + ')');

    g.appendChild(newEl);
}

function drawMap(mapSelector, plan) {
    var i;
    var $map = $(mapSelector);
    for (i = 0; i < plan.areas.length; ++i) {
        (function (area) {
            var $area = $map.find("#" + area.id);
            if ($area) {
                if (area.type > 0) {
                    var $area = $map.find("#" + area.id);
                    $area.attr("fill-opacity", 1);
                    $area.on("mouseenter", function () {
                        // $(this).addClass('active');
                        $(this).attr("fill", "#A6FFA1");
                    });
                    $area.on("mouseleave", function () {
                        // $(this).removeClass('active');
                        if (!($(this).attr('data-selected') === 'true'))
                            $(this).attr("fill", "#fff");
                    });
                    $area.on("click", function () {
                        showInfo(this, area);
                        var id = parseInt(this.getAttribute('id')) - 1;
                        var info = plan1.areas[id];
                        var square = info.square / 100;
                        var cost = plan1.legend[info.type].cost;
                        $('.b-active__square').html(Math.round(square));
                        $('.b-active__costval').html(Math.round(square * cost));
                        $(this).attr("fill", "#A6FFA1");
                        $('[data-selected="true"]').attr('data-selected', 'false').attr("fill", "#fff");
                        $(this).attr('data-selected', 'true');
                    });
                }
            }

        })(plan.areas[i]);
    }
}

$(function () {
    //$("#output").svg();
    //$(".container").svg();
    drawMap("#Plan1", plan1);
    var el = $('#62');
    var id = parseInt(el.attr('id')) - 1;
    var info = plan1.areas[id];
    var square = info.square / 100;
    var cost = plan1.legend[info.type].cost;
    showInfo(el[0], 0);
    $('.b-active__square').html(Math.round(square));
    $('.b-active__costval').html(Math.round(square * cost));
    el.attr("fill", "#A6FFA1");
    $('[data-selected="true"]').attr('data-selected', 'false').attr("fill", "#fff");
    el.attr('data-selected', 'true');
});