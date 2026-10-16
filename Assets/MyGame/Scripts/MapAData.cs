using System;

/// <summary>
/// Resources/MyGameData/map-a.json のデータ形式。
/// マップ配置の編集はC#ではなくJSON側で行います。
/// </summary>
[Serializable]
public class MapAData
{
    public int width = 72;
    public int height = 30;
    public int pixelsPerTile = 64;
    public int playerStartX = 26;
    public int playerStartY = 3;
    public string[] floorRows;
    public string[] wallCollisionRows;

    public bool IsValid(out string error)
    {
        if (width <= 0 || height <= 0)
        {
            error = "width と height は1以上にしてください。";
            return false;
        }
        if (pixelsPerTile <= 0)
        {
            error = "pixelsPerTile は1以上にしてください。";
            return false;
        }
        if (!RowsAreValid(floorRows, "floorRows", out error)) return false;
        if (!RowsAreValid(wallCollisionRows, "wallCollisionRows", out error)) return false;
        if (playerStartX < 0 || playerStartX >= width || playerStartY < 0 || playerStartY >= height)
        {
            error = "playerStartX / playerStartY がマップ範囲外です。";
            return false;
        }
        error = null;
        return true;
    }

    private bool RowsAreValid(string[] rows, string fieldName, out string error)
    {
        if (rows == null || rows.Length != height)
        {
            error = fieldName + " は height と同じ " + height + " 行にしてください。";
            return false;
        }
        for (int y = 0; y < height; y++)
        {
            if (rows[y] == null || rows[y].Length != width)
            {
                error = fieldName + " の " + y + " 行目は width と同じ " + width + " 文字にしてください。";
                return false;
            }
            for (int x = 0; x < width; x++)
            {
                if (rows[y][x] != '0' && rows[y][x] != '1')
                {
                    error = fieldName + " の " + y + " 行目、" + x + " 列目は 0 または 1 にしてください。";
                    return false;
                }
            }
        }
        error = null;
        return true;
    }

    public int GetFloor(int x, int y)
    {
        return rowsValue(floorRows, x, y);
    }

    public int GetWallCollision(int x, int y)
    {
        return rowsValue(wallCollisionRows, x, y);
    }

    private int rowsValue(string[] rows, int x, int y)
    {
        if (rows == null || y < 0 || y >= rows.Length || rows[y] == null || x < 0 || x >= rows[y].Length)
            return 0;
        return rows[y][x] == '1' ? 1 : 0;
    }
}
