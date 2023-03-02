import {createSignal} from "solid-js";
import { Button } from "@suid/material";
function Multiplier() {
    const [count, setCount] = createSignal(2);
    const [multiplier, setMultiplier] = createSignal(2);

    const product = () => count() * multiplier();

    return (
        <div>
            <h1>
                {count()} * {multiplier()} = {product()}
            </h1>
            <Button variant="contained" onClick={() => setCount(count() + 1)}>Counter</Button>
            <Button variant="contained" onClick={() => setMultiplier(multiplier() + 1)}>multiplier</Button>
        </div>
    );
}
export default Multiplier;