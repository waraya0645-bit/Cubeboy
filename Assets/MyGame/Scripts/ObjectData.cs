using System;

/// <summary>Resources/MyGameData/objects.json のルート形式。</summary>
[Serializable]
public class ObjectDataFile
{
    public ObjectEntry[] objects;
}

/// <summary>JSONで編集するオブジェクト1個分の設定。</summary>
[Serializable]
public class ObjectEntry
{
    public string id;
    public int tileX;
    public int tileY;
    public string image;
    public float hitboxWidth = 31f;
    public float hitboxHeight = 30f;
    public bool interactable = true;
    public string interactionType = "none";
    public bool initiallyActive = true;
    public string revealsObjectId;
    public string itemId;
}
