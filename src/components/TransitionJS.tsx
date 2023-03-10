import {createSignal, ParentComponent} from "solid-js";
import {Transition} from "solid-transition-group";


const TransitionJS: ParentComponent = (props) => {
    const [show, toggleShow] = createSignal(true);
    return (
            <Transition
                onBeforeEnter={(el: any) => (el.style.opacity = 0)}
                onEnter={(el, done) => {
                    const a = el.animate([{opacity: 0}, {opacity: 1}], {
                        duration: 300
                    });
                    a.finished.then(done);
                }}
                onAfterEnter={(el: any) => (el.style.opacity = 1)}
                onExit={(el, done) => {
                    const a = el.animate([{opacity: 1}, {opacity: 0}], {
                        duration: 300
                    });
                    a.finished.then(done);
                }}
            >
                {show() && props.children}
            </Transition>
    );
}

export default TransitionJS;
