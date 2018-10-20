---
---

(function () {
    window.app = window.app || {};

    var $partsGrid = $('.parts-grid');
    var $sidebarWrapper = $('#sidebar-wrapper');

    if (window.app.parts) {
        createPartsElements();
        initializeGrid();
    } else {
        window.app.parts = function (parts) {
            window.app.parts = parts;
            createPartsElements();
            initializeGrid();
        }
    }

    function getPartInfoText(part) {
        return $('<h3 class="title text-warning">' + part.v.title + '</h3>\
    <div class="view-more-wrapper"><button aria-control="sidebar-wrapper" class="view-more btn btn-danger">View More</button>\
    <button class="do-compare btn btn-warning">Add</button></div>\
    <div class="details"><table><tr><td>Author: </td><td class="text-muted">'+ part.v.author + '</td></tr>\
    <tr><td>Category: </td><td class="text-muted">'+ part.v.category + '</td></tr>\
    <tr><td>Cost: </td><td class="text-muted">'+ part.v.cost + '</td></tr>\
    <tr><td>Mass: </td><td class="text-muted">'+ part.v.mass + '</td></tr></table></div>\
    <div>Description: </div><div class="desc text-muted"><small>'+ part.v.description + '</small></div>');

        // <tr><td><b>entryCost:</b></td><td>'+part.v.entryCost+'</td></tr>\
        // <tr><td><b>crashTolerance:</b></td><td>'+part.v.crashTolerance+'</td></tr>\
        // <tr><td><b>manufacturer:</b></td><td>'+part.v.manufacturer+'</td></tr>\
        // <tr><td><b>maxTemp:</b></td><td>'+part.v.maxTemp+'</td></tr></table>\
    }

    function createGraph(part) {
        var $htmlRet = $(document.createElement('div'));
        $htmlRet.append($(document.createElement('h3')).text(part.name || '<Unknown>'));
        for (var key in part.v) {
            if (part.v.hasOwnProperty(key) && key !== 'image') {
                $htmlRet.append(
                    $(document.createElement('p')).text(': ' + part.v[key])
                        .prepend($(document.createElement('b'))
                            .text(camelCaseToSentence(key)))
                );
            }
        }
        for (var j = 0; j < (part.n || []).length; j++) {
            $htmlRet.append(createGraph(part.n[j]).addClass('scoped-graph'));
        }
        return $htmlRet;
    }

    function openDetailNav(part) {
        var $content = $sidebarWrapper.find('.sidebar-content');
        $content.empty();
        if (part.v.image) {
            $content.append($(document.createElement('img')).attr('src', '{{ "/assets/img/parts/thumbs/" | absolute_url }}'
                + escape(part.v.image) + '.png'));
        }
        $content.append(createGraph(part));
        $sidebarWrapper.addClass('open');
        if ($sidebarWrapper.hasClass('open')) {
            $sidebarWrapper.addClass('closing');
            setTimeout(function () { $sidebarWrapper.removeClass('closing') }, 200);
        }
    }

    $('#close-sidebar').on('click', function () {
        $sidebarWrapper.removeClass('open');
    });

    function createPartsElements() {
        console.log('creating parts');
        var tcats = {};
        var frag = document.createDocumentFragment();
        for (var i = 0; i < window.app.parts.length; i++) {
            var part = window.app.parts[i];
            var $item = $(document.createElement('article')).addClass('part-item').attr('id', 'pitem-' + i);
            var $content = $(document.createElement('div')).addClass('content');
            var $text = $(document.createElement('div')).addClass('text');
            var $textContent = getPartInfoText(part);
            (function () {
                var p = part, index = i;
                $textContent.find('button.view-more').on('click', function (e) {
                    openDetailNav(p);
                });
                $textContent.find('button.do-compare').on('click', function (e) {
                    var alreadyexists = window.app.compare.parts.indexOf(p) !== -1;
                    window.app.compare[alreadyexists ? 'remove' : 'add'](p);
                    $(this)[alreadyexists ? 'removeClass' : 'addClass']('remove');
                    $(this).text(alreadyexists ? 'Add' : 'Remove');
                });
            })();
            $text.html($textContent);
            $content.append($text);
            $item.append($content);
            $.data($item.get(0), 'i', i);
            part.v.image ? $content.css('background-image', 'url({{ "/assets/img/parts/med/" | absolute_url }}'
                + escape(part.v.image) + '.png)')
                : $content.addClass('img-not-found');
            frag.appendChild($item[0]);
        }
        $partsGrid[0].appendChild(frag);
    }

    function initializeGrid() {

        var parts = window.app.parts;
        console.log('initializing grid');
        var $grid = $('.parts-grid').isotope({
            sortBy: 'original-order',
            sortAscending: $('#sort-order').val() === 'ASC',
            itemSelector: '.part-item',
            getSortData: {
                title: function (itemElem) {
                    return parts[$.data(itemElem, 'i')].v.title;
                },
                author: function (itemElem) {
                    return parts[$.data(itemElem, 'i')].v.author;
                },
                entrycost: function (itemElem) {
                    return parseFloat(parts[$.data(itemElem, 'i')].v.entryCost);
                },
                cost: function (itemElem) {
                    return parseFloat(parts[$.data(itemElem, 'i')].v.cost);
                },
                manufacturer: function (itemElem) {
                    return parts[$.data(itemElem, 'i')].v.manufacturer;
                },
                mass: function (itemElem) {
                    return parseFloat(parts[$.data(itemElem, 'i')].v.mass);
                },
                explosionpotential: function (itemElem) {
                    var p = parseFloat(parts[$.data(itemElem, 'i')].v.explosionPotential) || 0;
                    return parseFloat(parts[$.data(itemElem, 'i')].v.explosionPotential) || 0;
                },
                category: function (itemElem) {
                    return parts[$.data(itemElem, 'i')].v.category;
                },
                // symbol: '.symbol',
                // number: '.number parseInt',
                // weight: function (itemElem) {
                //     var weight = $(itemElem).find('.weight').text();
                //     return parseFloat(weight.replace(/[\(\)]/g, ''));
                // }
            }
        });

        $('#sort-order').on('change', function (e) {
            $grid.isotope({
                sortAscending: $(this).val() === 'ASC',
            });
        });

        // filter functions
        var filterFns = {
            // show if number is greater than 50
            numberGreaterThan50: function () {
                var number = $(this).find('.number').text();
                return parseInt(number, 10) > 50;
            },
            // show if name ends with -ium
            ium: function () {
                var name = $(this).find('.name').text();
                return name.match(/ium$/);
            },
            crossfeedAll: function () {
                return true;
            },
            crossfeedEnabled: function () {
                return parseBool(parts[$.data(this, 'i')].v.fuelCrossFeed || 'True');
            },
            crossfeedDisabled: function () {
                return !parseBool(parts[$.data(this, 'i')].v.fuelCrossFeed || 'True');
            }
        };

        ["Aero", "Control", "Propulsion", "Payload", "Thermal", "Pods", "Utility", "FuelTank", "Structural",
            "Electrical", "Engine", "Science", "Communication", "none", "Coupling", "Ground"].forEach(function (x) {
                filterFns['categoryFilter' + x] = function (itemElem) {
                    return parts[$.data(this, 'i')].v.category === x;
                }
            });
        filterFns['categoryFilterAll'] = function () {
            return true;
        }

        function refreshFilters() {
            var filterFuncs = [];
            $('.filter-select').each(function () {
                var filterValue = this.value;
                // use filterFn if matches value
                filterValue = filterFns[filterValue] || filterValue;
                filterFuncs.push(filterValue);
            });
            $('button.filter-control').each(function () {
                var filterValue = $(this).attr('data-filter');
                // use filterFn if matches value
                filterValue = filterFns[filterValue] || filterValue;
                filterFuncs.push(filterValue);
            });
            $grid.isotope({
                filter: function () {
                    var _this = this;
                    return filterFuncs.every(function (func) { return func.call(_this) });
                }
            });
        }

        $('.filter-select').on('change', refreshFilters);

        // bind filter button click
        $('#filters').on('click', 'button', refreshFilters);

        // bind sort button click
        $('#sorts').on('click', 'button', function () {
            var sortByValue = $(this).attr('data-sort-by');
            $grid.isotope({ sortBy: sortByValue });
        });

        // change is-checked class on buttons
        $('.button-group').each(function (i, buttonGroup) {
            var $buttonGroup = $(buttonGroup);
            $buttonGroup.on('click', 'button', function () {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $(this).addClass('is-checked');
            });
        });
    }
})();


