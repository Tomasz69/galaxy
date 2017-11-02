"use strict";define(["utils/utils","mvc/form/form-view","mvc/tool/tool-form-base"],function(e,t,a){function o(e){var t=e.model.attributes,a=t.workflow,o=t.node;t.inputs.unshift({type:"text",name:"__annotation",label:"Annotation",fixed:!0,value:o.annotation,area:!0,help:"Add an annotation or notes to this step. Annotations are available when a workflow is viewed."}),t.inputs.unshift({type:"text",name:"__label",label:"Label",value:o.label,help:"Add a step label.",fixed:!0,onchange:function(t){var n=!1;for(var i in a.nodes){var l=a.nodes[i];if(l.label&&l.label==t&&l.id!=o.id){n=!0;break}}var r=e.data.match("__label");e.element_list[r].model.set("error_text",n&&"Duplicate label. Please fix this before saving the workflow."),e.trigger("change")}})}function n(e){function t(e,a){(a=a||[]).push(e);for(var o in e.inputs){var n=e.inputs[o];if(n.action){if(n.name="pja__"+s+"__"+n.action,n.pja_arg&&(n.name+="__"+n.pja_arg),n.payload)for(var i in n.payload)n.payload[n.name+"__"+i]=n.payload[i],delete n.payload[i];var l=r[n.action+s];if(l){for(var u in a)a[u].expanded=!0;n.pja_arg?n.value=l.action_arguments&&l.action_arguments[n.pja_arg]||n.value:n.value="true"}}n.inputs&&t(n,a.slice(0))}}var a=e.model.attributes,o=a.inputs,n=a.datatypes,i=a.node,l=a.workflow,r=i.post_job_actions,s=i.output_terminals&&Object.keys(i.output_terminals)[0];if(s){o.push({name:"pja__"+s+"__EmailAction",label:"Email notification",type:"boolean",value:String(Boolean(r["EmailAction"+s])),ignore:"false",help:"An email notification will be sent when the job has completed.",payload:{host:window.location.host}}),o.push({name:"pja__"+s+"__DeleteIntermediatesAction",label:"Output cleanup",type:"boolean",value:String(Boolean(r["DeleteIntermediatesAction"+s])),ignore:"false",help:"Upon completion of this step, delete non-starred outputs from completed workflow steps if they are no longer required as inputs."});for(var u in i.output_terminals)o.push(function(e,a){var o=[],n=[];for(var r in a)o.push({0:a[r],1:a[r]});for(r in i.input_terminals)n.push(i.input_terminals[r].name);o.sort(function(e,t){return e.label>t.label?1:e.label<t.label?-1:0}),o.unshift({0:"Sequences",1:"Sequences"}),o.unshift({0:"Roadmaps",1:"Roadmaps"}),o.unshift({0:"Leave unchanged",1:"__empty__"});var s,u={title:"Configure Output: '"+e+"'",type:"section",flat:!0,inputs:[{label:"Label",type:"text",value:(s=i.getWorkflowOutput(e))&&s.label||"",help:"This will provide a short name to describe the output - this must be unique across workflows.",onchange:function(t){l.attemptUpdateOutputLabel(i,e,t)}},{action:"RenameDatasetAction",pja_arg:"newname",label:"Rename dataset",type:"text",value:"",ignore:"",help:'This action will rename the output dataset. Click <a href="https://galaxyproject.org/learn/advanced-workflow/variables/">here</a> for more information. Valid inputs are: <strong>'+n.join(", ")+"</strong>."},{action:"ChangeDatatypeAction",pja_arg:"newtype",label:"Change datatype",type:"select",ignore:"__empty__",value:"__empty__",options:o,help:"This action will change the datatype of the output to the indicated value."},{action:"TagDatasetAction",pja_arg:"tags",label:"Add Tags",type:"text",value:"",ignore:"",help:"This action will set tags for the dataset."},{action:"RemoveTagDatasetAction",pja_arg:"tags",label:"Remove Tags",type:"text",value:"",ignore:"",help:"This action will remove tags for the dataset."},{title:"Assign columns",type:"section",flat:!0,inputs:[{action:"ColumnSetAction",pja_arg:"chromCol",label:"Chrom column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"startCol",label:"Start column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"endCol",label:"End column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"strandCol",label:"Strand column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"nameCol",label:"Name column",type:"integer",value:"",ignore:""}],help:"This action will set column assignments in the output dataset. Blank fields are ignored."}]};return t(u),u}(u,n))}}return{Default:Backbone.View.extend({initialize:function(a){var n=this,i=a.node;this.form=new t(e.merge(a,{onchange:function(){e.request({type:"POST",url:Galaxy.root+"api/workflows/build_module",data:{id:i.id,type:i.type,content_id:i.content_id,inputs:n.form.data.create()},success:function(e){i.update_field_data(e)}})}})),o(this.form),this.form.render()}}),Tool:Backbone.View.extend({initialize:function(t){var o=this,n=t.node;this.form=new a(e.merge(t,{text_enable:"Set in Advance",text_disable:"Set at Runtime",narrow:!0,initial_errors:!0,cls:"ui-portlet-narrow",initialmodel:function(e,t){o._customize(t),e.resolve()},buildmodel:function(e,t){t.model.get("postchange")(e,t)},postchange:function(t,a){var i=a.model.attributes,l={tool_id:i.id,tool_version:i.version,type:"tool",inputs:$.extend(!0,{},a.data.create())};Galaxy.emit.debug("tool-form-workflow::postchange()","Sending current state.",l),e.request({type:"POST",url:Galaxy.root+"api/workflows/build_module",data:l,success:function(e){a.model.set(e.config_form),o._customize(a),a.update(e.config_form),a.errors(e.config_form),n.update_field_data(e),Galaxy.emit.debug("tool-form-workflow::postchange()","Received new model.",e),t.resolve()},error:function(e){Galaxy.emit.debug("tool-form-workflow::postchange()","Refresh request failed.",e),t.reject()}})}}))},_customize:function(t){var a=t.model.attributes;e.deepeach(a.inputs,function(t){t.type&&(-1!=["data","data_collection"].indexOf(t.type)?(t.type="hidden",t.info="Data input '"+t.name+"' ("+e.textify(t.extensions)+")",t.value={__class__:"RuntimeValue"}):t.fixed||(t.collapsible_value={__class__:"RuntimeValue"},t.is_workflow=t.options&&0==t.options.length||-1!=["integer","float"].indexOf(t.type)))}),e.deepeach(a.inputs,function(e){"conditional"==e.type&&(e.test_param.collapsible_value=void 0)}),n(t),o(t)}})}});
//# sourceMappingURL=../../../maps/mvc/workflow/workflow-forms.js.map