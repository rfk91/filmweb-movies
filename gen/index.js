"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var pptr = require("puppeteer");
var async_foreach_1 = require("./async-foreach");
var dir = './gen/';
var URL = 'https://www.filmweb.pl/films/search?orderBy=popularity&descending=true';
var viewport = {
    width: 800,
    height: 2840
};
var startPage = 1;
var pages = 100;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, allMovies, i, movies, mergedMovies, meta, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 14, , 15]);
                return [4 /*yield*/, pptr.launch({
                        headless: true
                    })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.setViewport(viewport)];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.goto(URL + "&page=1", {
                        waitUntil: 'networkidle0'
                    })];
            case 4:
                _a.sent();
                // Close GDPR popup
                return [4 /*yield*/, page.click('button.fwBtn.fwBtn--gold')];
            case 5:
                // Close GDPR popup
                _a.sent();
                allMovies = [];
                i = startPage;
                _a.label = 6;
            case 6:
                if (!(i < pages + startPage)) return [3 /*break*/, 12];
                // Log current page number
                console.log("Current page number: " + i);
                if (!(i > 1)) return [3 /*break*/, 8];
                return [4 /*yield*/, page.goto(URL + "&page=" + i, {
                        waitUntil: 'networkidle0'
                    })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [4 /*yield*/, page.screenshot({
                    path: dir + "page-" + i + ".png"
                })];
            case 9:
                _a.sent();
                return [4 /*yield*/, grabMovies(page)];
            case 10:
                movies = _a.sent();
                allMovies.push(movies);
                _a.label = 11;
            case 11:
                i++;
                return [3 /*break*/, 6];
            case 12:
                mergedMovies = [].concat.apply([], allMovies);
                fs.writeFile(dir + "result.json", JSON.stringify(mergedMovies), function (err) {
                    if (err)
                        throw err;
                    console.log('result.json file saved ok!');
                });
                meta = {
                    length: mergedMovies.length
                };
                fs.writeFile(dir + "/meta.json", JSON.stringify(meta), function (err) {
                    if (err)
                        throw err;
                    console.log('meta.json file saved ok!');
                });
                return [4 /*yield*/, browser.close()];
            case 13:
                _a.sent();
                return [3 /*break*/, 15];
            case 14:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); })();
function grabMovies(page) {
    return __awaiter(this, void 0, void 0, function () {
        var moviesEl, movies;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.$$('.hits__item')];
                case 1:
                    moviesEl = _a.sent();
                    movies = [];
                    return [4 /*yield*/, async_foreach_1.asyncForEach(moviesEl, function (movieEl) { return __awaiter(_this, void 0, void 0, function () {
                            var posterEl, posterElProp, poster, titleEl, titleElProp, title, originalTitle, originalTitleEl, originalTitleElProp, descriptionEl, descriptionElProp, description, rateEl, rateElProp, rate, yearEl, yearElProp, year;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, movieEl.$('.filmPreview__poster .poster__image')];
                                    case 1:
                                        posterEl = _a.sent();
                                        return [4 /*yield*/, posterEl.getProperty('src')];
                                    case 2:
                                        posterElProp = _a.sent();
                                        return [4 /*yield*/, posterElProp.jsonValue()];
                                    case 3:
                                        poster = _a.sent();
                                        return [4 /*yield*/, movieEl.$('.filmPreview__title')];
                                    case 4:
                                        titleEl = _a.sent();
                                        return [4 /*yield*/, titleEl.getProperty('innerText')];
                                    case 5:
                                        titleElProp = _a.sent();
                                        return [4 /*yield*/, titleElProp.jsonValue()];
                                    case 6:
                                        title = _a.sent();
                                        // Log movie titles as we go...
                                        console.log(title);
                                        return [4 /*yield*/, movieEl.$('.filmPreview__originalTitle')];
                                    case 7:
                                        originalTitleEl = _a.sent();
                                        if (!!originalTitleEl) return [3 /*break*/, 8];
                                        originalTitle = title;
                                        return [3 /*break*/, 11];
                                    case 8: return [4 /*yield*/, originalTitleEl.getProperty('innerText')];
                                    case 9:
                                        originalTitleElProp = _a.sent();
                                        return [4 /*yield*/, originalTitleElProp.jsonValue()];
                                    case 10:
                                        originalTitle = (_a.sent());
                                        _a.label = 11;
                                    case 11: return [4 /*yield*/, movieEl.$('.filmPreview__description > p')];
                                    case 12:
                                        descriptionEl = _a.sent();
                                        return [4 /*yield*/, descriptionEl.getProperty('innerText')];
                                    case 13:
                                        descriptionElProp = _a.sent();
                                        return [4 /*yield*/, descriptionElProp.jsonValue()];
                                    case 14:
                                        description = _a.sent();
                                        return [4 /*yield*/, movieEl.$('.rateBox__rate')];
                                    case 15:
                                        rateEl = _a.sent();
                                        return [4 /*yield*/, rateEl.getProperty('innerText')];
                                    case 16:
                                        rateElProp = _a.sent();
                                        return [4 /*yield*/, rateElProp.jsonValue()];
                                    case 17:
                                        rate = _a.sent();
                                        return [4 /*yield*/, movieEl.$('.filmPreview__year')];
                                    case 18:
                                        yearEl = _a.sent();
                                        return [4 /*yield*/, yearEl.getProperty('innerText')];
                                    case 19:
                                        yearElProp = _a.sent();
                                        return [4 /*yield*/, yearElProp.jsonValue()];
                                    case 20:
                                        year = _a.sent();
                                        movies.push({
                                            poster: poster,
                                            title: title,
                                            originalTitle: originalTitle,
                                            description: description,
                                            rate: rate,
                                            year: year
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, movies];
            }
        });
    });
}
