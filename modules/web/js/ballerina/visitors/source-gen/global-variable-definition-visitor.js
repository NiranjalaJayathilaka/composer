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

import AbstractSourceGenVisitor from './abstract-source-gen-visitor';
import AnnotationAttachmentVisitor from './annotation-attachment-visitor';

/**
 * Visitor for a global variable definition.
 */
class GlobalVariableDefinitionVisitor extends AbstractSourceGenVisitor {

    /**
     * Can visit check for the global variable definition
     * @return {boolean} true|false
     */
    canVisitGlobalVariableDefinition() {
        return true;
    }

    /**
     * Begin source generation visit for the Global variable Definition
     * @param {GlobalVariableDefinition} globalVariableDefinition - Global variable Definition ASTNode
     */
    beginVisitGlobalVariableDefinition(globalVariableDefinition) {
        const useDefaultWS = globalVariableDefinition.whiteSpace.useDefault;
        if (useDefaultWS) {
            this.currentPrecedingIndentation = this.getCurrentPrecedingIndentation();
            this.replaceCurrentPrecedingIndentation('\n' + this.getIndentation());
        }

        // Calculate the line number
        const lineNumber = this.getTotalNumberOfLinesInSource() + 1;
        globalVariableDefinition.setLineNumber(lineNumber, { doSilently: true });

        // Adding annotations
        let constructedSourceSegment = '';
        globalVariableDefinition.getChildrenOfType(globalVariableDefinition.getFactory().isAnnotationAttachment).forEach(
            (annotationAttachment) => {
                const annotationAttachmentVisitor = new AnnotationAttachmentVisitor(this);
                annotationAttachment.accept(annotationAttachmentVisitor);
            });

        constructedSourceSegment += globalVariableDefinition.getGlobalVariableDefinitionAsString();

        const numberOfNewLinesAdded = this.getEndLinesInSegment(constructedSourceSegment);
        // Increase the total number of lines
        this.increaseTotalSourceLineCountBy(numberOfNewLinesAdded);
        this.appendSource(constructedSourceSegment);
    }

    /**
     * Visit Global Variable Definition
     */
    visitGlobalVariableDefinition() {
    }

    /**
     * End source generation visit for the Global variable Definition
     * @param {GlobalVariableDefinition} globalVariableDefinition - Global variable Definition ASTNode
     */
    endVisitGlobalVariableDefinition(globalVariableDefinition) {
        const constructedSourceSegment = ';' + globalVariableDefinition.getWSRegion(4)
            + ((globalVariableDefinition.whiteSpace.useDefault) ? this.currentPrecedingIndentation : '');

        // Add the increased number of lines
        const numberOfNewLinesAdded = this.getEndLinesInSegment(constructedSourceSegment);
        this.increaseTotalSourceLineCountBy(numberOfNewLinesAdded);

        this.appendSource(constructedSourceSegment);
        this.getParent().appendSource(this.getGeneratedSource());
    }
}

export default GlobalVariableDefinitionVisitor;
