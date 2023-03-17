import {Component, createEffect, createSignal, For, onMount} from "solid-js";
import {closeSubSettings} from "../FormField";
import {createKeyHold} from "@solid-primitives/keyboard";


type ExcelSelectOptions = {
    cells: string[] | undefined
}

type SelectOptions = {
    id: number
}

const Select: Component<SelectOptions> = (props) => {
    let select: HTMLSelectElement | undefined;


    onMount(() => {
        if (!select) return;
        select.addEventListener('focus', () => {
            select!.size = 5;
            select!.classList.add('fadeIn');
            select!.classList.remove('fadeOut');
            select!.style.backgroundColor = '#FFF';
        });

        select.addEventListener('blur', () => {
            select!.size = 1;
            select!.classList.add('fadeOut');
            select!.classList.remove('fadeIn');
            select!.style.backgroundColor = '#FFF';
        });

        select.addEventListener('change', () => {
            select!.size = 1;
            select!.blur();
            select!.style.backgroundColor = '#FFF';
        });

        select.addEventListener('mouseover', () => {
            if (select!.size === 1) {
                select!.style.backgroundColor = 'rgb(247, 247, 247)';
            }
        });
        select.addEventListener('mouseout', () => {
            if (select!.size === 1) {
                select!.style.backgroundColor = '#FFF';
            }
        });

    });

    return (
        <select
            size="{props.id}"
            ref={select}
        >
            <option value="">Select an option</option>
            <option value="1">E-mail</option>
            <option value="2">Name</option>
            <option value="3">Surname</option>
        </select>
    );
};

const ExcelSelect: Component<ExcelSelectOptions> = (props) => {
    return (
        <div
            class="select-columns"
        >
            <For each={props.cells}>{(cell, i) =>
                <div class="select-columns__column">
                    <div class="select-columns__column-name">{cell}</div>
                    <div class="select-columns__select"><Select id={i()}/></div>
                </div>
            }</For>
        </div>
    );
};


export default ExcelSelect;