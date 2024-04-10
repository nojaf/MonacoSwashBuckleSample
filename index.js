
import loader from "@monaco-editor/loader"

const nojafPlugin = {
    components: {
        SyntaxHighlighter: (props) => {
            const React = props.React;
            const myRef = React.createRef();
            React.useEffect(() => {
                let editor = null;

                const cancelable = loader.init();
                cancelable.then(monaco => {
                    if (myRef.current) {
                        editor = monaco.editor.create(myRef.current, {
                            value: props.children,
                            language: props.language
                        })
                    }
                }).catch(
                    (error) =>
                        error?.type !== 'cancelation' && console.error('Monaco initialization: error:', error),
                );

                return () => {
                    if (cancelable && !myRef.current) {
                        cancelable.cancel();
                    }

                    if (editor) {
                        editor.dispose();
                    }
                }

            }, [myRef, props.children]);


            // The container needs a height.
            const maxHeight = 450;
            const newLineCount = !props.children ? 0 : (props.children.match(/\n/g)).length
            const proposedHeight = (newLineCount * 14)
            const minHeight = Math.max(100, Math.min(proposedHeight, maxHeight));

            return React.createElement("div", {ref: myRef, style: {minHeight: `${minHeight}px`}}, null);
        }
    }
}

import SwaggerUI  from "swagger-ui"; 

window.addEventListener("load", () => {
    SwaggerUI({
        dom_id: "#app",
        url: "/swagger/v1/swagger.json",
        plugins: [ nojafPlugin ]
    })
})