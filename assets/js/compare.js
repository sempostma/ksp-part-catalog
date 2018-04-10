---
---

(function() {
    window.app = window.app || {};
    var $upDownBtn = $('#up-down-compare');
    var $cmpContent = $('#compare-parts-content');
    var $runCompare = $('#run-compare');
    var $sidebarWrapper = $('#sidebar-wrapper');

    $upDownBtn.on('click', function() {
        var alreadyactive = $cmpContent.hasClass('compare-open');
        $cmpContent[alreadyactive ? 'removeClass' : 'addClass']('compare-open');
        $upDownBtn[alreadyactive ? 'removeClass' : 'addClass']('compare-open');
    });

    window.app.compare = new (function() {
        this.parts = [];
        this.add = function(part) {
            if (this.parts.indexOf(part) !== -1) {
                throw Error("part compare already exists");
            }
            this.parts.push(part);
            $('#compare-dialog-wrapper').addClass('compare-visible');
            $cmpContent.empty().append(createContent(this.parts));
        }
        this.remove = function(part) {
            var index = this.parts.indexOf(part);
            this.parts.splice(index, 1);
            $('#compare-dialog-wrapper')[this.parts.length > 0 ? 'addClass' : 'removeClass']('compare-visible');
            $cmpContent.empty().append(createContent());
        }
    })();

    $cmpContent.on('click', '.remove-btn', function(e) {
        var partIndex = parseInt($(this).attr('data-i'));
        var part = window.app.compare.parts[partIndex];
        window.app.compare.remove(part);
        var allPartsIndex = window.app.parts.indexOf(part);
        $('#pitem-' + allPartsIndex).find('button.do-compare').removeClass('remove');
        $('#pitem-' + allPartsIndex).find('button.do-compare').text('Add');
    });

    function createContent() {
        var partList = window.app.compare.parts;
        var $list = $(document.createElement('ul'));
        var $li, $a, $rBtn;
        for(var i = 0; i < partList.length; i++) {
            $li = $(document.createElement('li'));
            $rBtn = $(document.createElement('i')).addClass('remove-btn fa fa-times').attr('role', 'button').attr('data-i', i);
            $a = $(document.createElement('a')).text(partList[i].v.title).attr('href', '#pitem-' + window.app.parts.indexOf(partList[i]));
            $li.append($rBtn).append($a);
            $list.append($li);
        }
        return $list;
    }

    $runCompare.on('click', function() {
        openCompareNav(window.app.compare.parts);
    });

    function openCompareNav(compareParts) {
        $sidebarWrapper.find('.sidebar-content').empty().append(createCompareContent(compareParts));
        $sidebarWrapper.addClass('open');
        if ($sidebarWrapper.hasClass('open')) {
            $sidebarWrapper.addClass('closing');
            setTimeout(function(){ $sidebarWrapper.removeClass('closing')}, 200);
        }
    }

    function createCompareContent(compareParts) {
        var $content = $(document.createElement('div')).addClass('compare-parts');
        var totalMass = compareParts
            .map(function(part) { return parseFloat(part.v.mass); })
            .reduce(function(sum, item) { return sum + item; }).toFixed(2);
        var totalCost = compareParts
            .map(function(part) { return parseFloat(part.v.cost); })
            .reduce(function(sum, item) { return sum + item; }).toFixed(0);
        var totalEntryCost = compareParts
            .map(function(part) { return parseFloat(part.v.entryCost); })
            .reduce(function(sum, item) { return sum + item; }).toFixed(0);
        var maxTemp = Math.min.apply(null, compareParts
            .map(function(part) { return parseFloat(part.v.maxTemp); })).toFixed(0);

        $content.append($(document.createElement('div')).text('Total mass: ' + totalMass));
        $content.append($(document.createElement('div')).text('Total cost: ' + totalCost));
        $content.append($(document.createElement('div')).text('Total entry cost: ' + totalEntryCost));
        $content.append($(document.createElement('div')).text('Max Temp: ' + maxTemp));

        var $item;
        var part;
        var vals = ['title', 'author', 'entryCost', 'cost', 'category', 'name', 'manufacturer', 'mass', 'crashTolerance', 'maxTemp', 'fuelCrossFeed', 'description'];
        var key;
        for(var i = 0; i < compareParts.length; i++) {
            part = compareParts[i];
            $content.append($(document.createElement('hr')));
            $item = $(document.createElement('div'));
            part.v.image && $item.append($(document.createElement('p'))
                .append($(document.createElement('img'))
                .attr('src', '{{ "/assets/img/parts/thumbs/" | absolute_url }}'
                    + escape(part.v.image) + '.png')));
            
            for (var j = 0; j < vals.length; j++) {
                key = vals[j];
                if (part.v.hasOwnProperty(key)) {
                    $item.append(
                        $(document.createElement('p')).text(': ' + part.v[key])
                            .prepend($(document.createElement('b'))
                                .text(camelCaseToSentence(key)))
                    );
                }
            }
            $content.append($item);
        }
        return $content;
    }
})();


