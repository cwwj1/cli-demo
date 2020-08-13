/* eslint-disable */
const DEBUG = false;
let debug = DEBUG ? console.log.bind(console) : function () { };
import htmlParse from './htmlParse';

function removeDOCTYPE(html) {
    return html
        .replace(/<\?xml.*\?>\n/, '')
        .replace(/<!doctype.*>\n/, '')
        .replace(/<!DOCTYPE.*>\n/, '');
}

export const html2json = (html) => {
    html = removeDOCTYPE(html);
    let bufArray = [];
    let results = {
        node: 'root',
        children: [],
    };
    htmlParse.HTMLParser(html, {
        start(tag, attrs, unary) {
            debug(tag, attrs, unary);
            // node for this element
            let node = {
                // node: 'element',
                name: tag,
            };
            if (attrs.length !== 0) {
                node.attrs = attrs.reduce(function (pre, attr) {
                    let name = attr.name;
                    let value = attr.value;

                    // has multi attibutes
                    // make it array of attribute
                    if (value.match(/ /) && name !== 'style') {
                        value = value.split(' ');
                    }

                    // if attr already exists
                    // merge it
                    if (pre[name]) {
                        if (Array.isArray(pre[name])) {
                            // already array, push to last
                            pre[name].push(value);
                        } else {
                            // single value, make it array
                            pre[name] = [pre[name], value];
                        }
                    } else {
                        // not exist, put it
                        pre[name] = value;
                    }

                    return pre;
                }, {});
            }
            if (unary) {
                // if this tag dosen't have end tag
                // like <img src="hoge.png"/>
                // add to parents
                let parent = bufArray[0] || results;
                if (parent.children === undefined) {
                    parent.children = [];
                }
                parent.children.push(node);
            } else {
                bufArray.unshift(node);
            }
        },
        end(tag) {
            debug(tag);
            // merge into parent tag
            let node = bufArray.shift();
            if (node.name !== tag) {
                console.error('invalid state: mismatch end tag');
            }

            if (bufArray.length === 0) {
                results.children.push(node);
            } else {
                let parent = bufArray[0];
                if (parent.children === undefined) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
        },
        chars(text) {
            debug(text);
            let node = {
                type: 'text',
                text,
            };
            if (bufArray.length === 0) {
                results.children.push(node);
            } else {
                let parent = bufArray[0];
                if (parent.children === undefined) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
        },
        comment(text) {
            debug(text);
            let node = {
                node: 'comment',
                text,
            };
            let parent = bufArray[0];
            if (parent.children === undefined) {
                parent.children = [];
            }
            parent.children.push(node);
        },
    });
    return results.children;
}
