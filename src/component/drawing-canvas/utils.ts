import Konva from "konva";
import { Observable, Observer } from "rxjs";

export function fromKonvaEvent(konvaShape: Konva.Node, eventName: string): Observable<Konva.KonvaEventObject<any>> {
    return new Observable((observer: Observer<Konva.KonvaEventObject<any>>) => {
        konvaShape.on(eventName, (ev: Konva.KonvaEventObject<any>) => observer.next(ev));
    });
}
