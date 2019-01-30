var scrollNav = document.getElementById("scrollNav");
var scrollNavContents = document.getElementById("scrollNavContents");

var scrollBtnLeft = document.getElementById("scrollBtnLeft");
var scrollBtnRight = document.getElementById("scrollBtnRight");

var SETTINGS = {
    navBarTravelling: false,
    navBarDirection: "",
    navBarTravelDistance: 150
}

function determineOverflow(content, container) {
    var containerMetrics = container.getBoundingClientRect();
    var containerMetricsRight = Math.floor(containerMetrics.right);
    var containerMetricsLeft = Math.floor(containerMetrics.left);
    var contentMetrics = content.getBoundingClientRect();
    var contentMetricsRight = Math.floor(contentMetrics.right);
    var contentMetricsLeft = Math.floor(contentMetrics.left);

    if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
        return "both";
    } else if (contentMetricsLeft < containerMetricsLeft) {
        return "left";
    } else if (contentMetricsRight > containerMetricsRight) {
        return "right";
    } else {
        return "none";
    }
}

scrollNav.setAttribute("data-overflowing", determineOverflow(scrollNavContents, scrollNav));

// Handle the scroll of the horizontal container
var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
    scrollNav.setAttribute("data-overflowing", determineOverflow(scrollNavContents, scrollNav));
}

scrollNav.addEventListener("scroll", function () {
    last_known_scroll_position = window.scrollX;
    if (!ticking) {
        window.requestAnimationFrame(function () {
            doSomething(last_known_scroll_position);
            ticking = false;
        });
    }
    ticking = true;
});

// Click arrow button
scrollBtnLeft.addEventListener("click", function () {
    // if in the middle
    if (SETTINGS.navBarTravelling === true) {
        return;
    }
    // if we have content overflow both side or on the left
    if (determineOverflow(scrollNavContents, scrollNav) === "left"
        || determineOverflow(scrollNavContents, scrollNav) === "both") {
        // Find how far this panel has been scrolled
        var availableScrollLeft = scrollNav.scrollLeft;
        // if the space available is less than two lots of our desired distance distance
        // otherwise, move by the amount in the settings
        if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2) {
            scrollNavContents.style.transform = "translateX(" + availableScrollLeft + "px)";
        } else {
            scrollNavContents.style.transform = "translateX(" + SETTINGS.navBarTravelDistance + "px)";
        }
        scrollNavContents.classList.remove("transition-none");
        // Update our settings
        SETTINGS.navBarTravelDirection = "left";
        SETTINGS.navBarTravelling = true;
    }
    // Update attribute in the DOM
    scrollNav.setAttribute("data-overflowing", determineOverflow(scrollNavContents, scrollNav));
});
scrollBtnRight.addEventListener("click", function () {
    // if in the middle
    if (SETTINGS.navBarTravelling === true) {
        return;
    }
    // in the both side or on the right
    if (determineOverflow(scrollNavContents, scrollNav) === "right"
        || determineOverflow(scrollNavContents, scrollNav) === "both") {
        var navBarRightEdge = scrollNavContents.getBoundingClientRect().right;
        var navBarScrollerRightEdge = scrollNav.getBoundingClientRect().right;
        // we know how much space we have available to scroll
        var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
        if (availableScrollRight < SETTINGS.navBarTravelDistance * 2) {
            scrollNavContents.style.transform = "translateX(-" + availableScrollRight + "px)";
        } else {
            scrollNavContents.style.transform = "translateX(-" + SETTINGS.navBarTravelDistance + "px)";
        }
        scrollNavContents.classList.remove("transition-none");
        // Update our settings
        SETTINGS.navBarTravelDirection = "right";
        SETTINGS.navBarTravelling = true;
    }
    // Update attribute in the DOM
    scrollNav.setAttribute("data-overflowing", determineOverflow(scrollNavContents, scrollNav));
});
scrollNavContents.addEventListener(
    "transitionend",
    function () {
        // get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
        var styleOfTransform = window.getComputedStyle(scrollNavContents, null);
        var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
        // If there is no transition we want to default to 0 and not null
        var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
        scrollNavContents.style.transform = "none";
        scrollNavContents.classList.add("transition-none");
        // Now lets set the scroll position
        if (SETTINGS.navBarTravelDirection === "left") {
            scrollNav.scrollLeft = scrollNav.scrollLeft - amount;
        } else {
            scrollNav.scrollLeft = scrollNav.scrollLeft + amount;
        }
        SETTINGS.navBarTravelling = false;
    },
    false
);

scrollNavContents.addEventListener("click", function (e) {
    // Make an array from each of the links in the nav
    var links = [].slice.call(document.querySelectorAll(".nav-scroll .nav-link"));
    // Turn all of them off
    links.forEach(function (item) {
        item.setAttribute("aria-selected", "false");
    })
    // Set the clicked one on
    e.target.setAttribute("aria-selected", "true");
})

// Sticky Header 

var currentHeight = 0;
var stickyHeader = document.getElementById("stickyHeader");
window.addEventListener("scroll", function (e) {
    var scrollHeight = window.scrollY;
    if (scrollHeight < currentHeight) {
        // show header
        stickyHeader.classList.add("sticky-top");
        stickyHeader.classList.add("shadow-sm");
        stickyHeader.classList.remove("header-unpinned");
        stickyHeader.classList.add("header-pinned");
    } else {
        stickyHeader.classList.remove("header-pinned");
        stickyHeader.classList.add("header-unpinned");
    }
    if (scrollHeight === 0) {
        stickyHeader.classList.remove("sticky-top");
        stickyHeader.classList.remove("shadow-sm");
    }
    // set current height to $currentHeight
    currentHeight = scrollHeight;
});