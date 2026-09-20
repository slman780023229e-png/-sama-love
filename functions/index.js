import { onValueCreated } from "firebase-functions/v2/database";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();

const REGION="us-central1";

function chunks(list,size){
  const out=[];
  for(let i=0;i<list.length;i+=size)out.push(list.slice(i,i+size));
  return out;
}

export const notifyNewSamaMessage=onValueCreated(
  {ref:"/sama_royal_chat/messages/{messageId}",region:REGION},
  async event=>{
    const message=event.data.val();
    if(!message||!message.sender)return;

    const snapshot=await getDatabase().ref("/sama_royal_chat/notificationTokens").get();
    if(!snapshot.exists())return;

    const registrations=[];
    snapshot.forEach(child=>{
      const value=child.val();
      if(!value?.token)return;
      if(message.clientId&&value.clientId&&message.clientId===value.clientId)return;
      registrations.push({
        key:child.key,
        token:value.token
      });
    });

    if(!registrations.length)return;

    const body=message.isVoice
      ?"🎙️ أرسل رسالة صوتية ملكية"
      :String(message.text||"لديك رسالة جديدة").slice(0,180);

    for(const batch of chunks(registrations,500)){
      const response=await getMessaging().sendEachForMulticast({
        tokens:batch.map(x=>x.token),
        data:{
          title:`💌 رسالة جديدة من ${String(message.sender)}`,
          body,
          sender:String(message.sender),
          time:String(message.time||""),
          timestamp:String(message.timestamp||Date.now()),
          isVoice:String(Boolean(message.isVoice)),
          messageId:String(event.params.messageId),
          url:"/?chat=1&message="+encodeURIComponent(String(event.params.messageId))
        }
      });

      const invalidKeys=[];
      response.responses.forEach((result,index)=>{
        if(!result.success){
          const code=result.error?.code||"";
          if(
            code.includes("registration-token-not-registered")||
            code.includes("invalid-registration-token")
          )invalidKeys.push(batch[index].key);
        }
      });

      await Promise.all(
        invalidKeys.map(key=>
          getDatabase().ref("/sama_royal_chat/notificationTokens/"+key).remove()
        )
      );
    }
  }
);