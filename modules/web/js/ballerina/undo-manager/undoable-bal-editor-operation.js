/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import UndoableOperation from './undoable-operation';
import SwitchToSourceViewConfirmDialog from './../../dialog/switch-to-source-confirm-dialog';
import { UNDO_EVENT, REDO_EVENT } from './../../constants/events';
import { CHANGE_EVT_TYPES } from './../views/constants';

/**
 * Class to represent an undoable operation in ballerina file editor
 * 
 * @class UndoableBalEditorOperation
 * @augments UndoableOperation
 */
class UndoableBalEditorOperation extends UndoableOperation {
    constructor(args) {
        super({
            oldContent: args.changeEvent.oldContent,
            newContent: args.changeEvent.newContent,
            file: args.file,
        });
        this.originEvt = args.changeEvent.originEvt;
        if (this.originEvt.type === CHANGE_EVT_TYPES.TREE_MODIFIED) {
            this.setTitle(this.originEvt.originEvt.title);
        } else if (this.originEvt.type === CHANGE_EVT_TYPES.SOURCE_MODIFIED) {
            this.doneFromSourceView = true;
            this.setTitle('Modify Source');
        }
    }

    undo() {
        this.getFile().setContent(this.getOldContent(), {
            type: UNDO_EVENT, 
            originEvt: this.originEvt,
        });
    }

    prepareUndo(next) {
        next(true);
    }

    redo() {
        this.getFile().setContent(this.getNewContent(), {
            type: REDO_EVENT, 
            originEvt: this.originEvt,
        });
    }

    prepareRedo(next) {
        next(true);
    }
}

export default UndoableBalEditorOperation;
